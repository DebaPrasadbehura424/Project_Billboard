import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import multer from "multer";
import fetch from "node-fetch";
import path from "path";
import connection from "../../database/TestDb.js";

const router = express.Router();
const secKey = "billboard@2025";
const GOOGLE_API_KEY = "AIzaSyAOd0c_05TGpxk6GFERgg4kU2QEqoZqJhM";
const UPLOAD_FOLDER = "uploads";

// Multer setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_FOLDER),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Helper: Convert image to base64 (byte format)
function getImageBase64(imagePath) {
  try {
    if (!fs.existsSync(imagePath)) throw new Error("Image file not found");
    const buffer = fs.readFileSync(imagePath);
    const base64 = buffer.toString("base64");
    console.log("Image converted to base64 for:", imagePath); // Debug log
    return base64;
  } catch (err) {
    console.error("Error reading image:", err);
    throw new Error(`Failed to read image: ${err.message}`);
  }
}

// Helper: Call Gemini API
async function callGeminiAPI(prompt, imageBase64 = null) {
  try {
    if (!GOOGLE_API_KEY) throw new Error("GOOGLE_API_KEY is not set");
    const body = {
      contents: [
        {
          parts: [
            { text: prompt },
            ...(imageBase64 ? [{ inlineData: { mimeType: "image/png", data: imageBase64 } }] : []),
          ],
        },
      ],
    };

    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GOOGLE_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Gemini API request failed: ${res.statusText}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Gemini API Response:", text); // Debug log
    return text || "";
  } catch (err) {
    console.error("Gemini API Error:", err);
    return "";
  }
}

// Helper: Check for mismatch between extracted text and description
async function checkMismatch(extractedText, description) {
  console.log("Checking mismatch:", { extractedText, description }); // Debug log
  try {
    // If description doesn't expect specific text, no mismatch for empty text
    const expectsSpecificText = description.toLowerCase().match(/says\s+['"]([^'"]+)['"]/i);
    if (!extractedText && !expectsSpecificText) {
      return {
        mismatch: false,
        mismatchDetails: "No text extracted, and description does not require specific text",
      };
    }

    // If description expects specific text, check if it matches
    if (expectsSpecificText) {
      const expectedText = expectsSpecificText[1].toLowerCase();
      if (!extractedText || !extractedText.includes(expectedText)) {
        return {
          mismatch: true,
          mismatchDetails: `Expected text "${expectedText}" not found in image`,
        };
      }
    }

    // Semantic check if text exists
    if (extractedText) {
      const prompt = `
        Given billboard text: "${extractedText}"
        Description: "${description}"
        Determine if the billboard text is relevant to the description.
        Return JSON with { mismatch: boolean, mismatchDetails: string }.
        A mismatch occurs if the billboard text is unrelated to the description.
      `;
      const mismatchStr = await callGeminiAPI(prompt);
      try {
        const mismatchInfo = JSON.parse(mismatchStr || "{}");
        console.log("Gemini Mismatch Result:", mismatchInfo); // Debug log
        return mismatchInfo.mismatch
          ? mismatchInfo
          : { mismatch: false, mismatchDetails: "Text aligns with description" };
      } catch (err) {
        console.error("Mismatch JSON Parse Error:", err);
      }
    }

    return {
      mismatch: false,
      mismatchDetails: "Text aligns with description or no specific text expected",
    };
  } catch (err) {
    console.error("Mismatch Check Error:", err);
    // Fallback: Keyword-based check
    const extractedWords = (extractedText || "").toLowerCase().split(/\s+/).filter(Boolean);
    const descWords = description.toLowerCase().split(/\s+/);
    const commonWords = extractedWords.filter(word => descWords.includes(word));
    const isMismatch = extractedWords.length > 0 && commonWords.length === 0;
    return {
      mismatch: isMismatch,
      mismatchDetails: isMismatch
        ? "Billboard text does not match description"
        : "Text aligns with description (fallback check)",
    };
  }
}

// Helper: Analyze billboard
async function analyzeBillboard(imagePath, description, latitude, longitude) {
  try {
    const imageBase64 = getImageBase64(imagePath);

    // Extract text
    let extractedText = "";
    try {
      extractedText = (await callGeminiAPI(
        "Extract all text visible in the billboard image. Return only the text.",
        imageBase64
      )).toLowerCase();
    } catch (err) {
      console.error("Text Extraction Error:", err);
      extractedText = "";
    }

    // Check for mismatch
    const mismatchInfo = await checkMismatch(extractedText, description);
    if (mismatchInfo.mismatch) {
      return { mismatch: true, mismatchDetails: mismatchInfo.mismatchDetails, extractedText };
    }

    // Content analysis
    let contentAnalysis = { obscene_detected: false, political_detected: false, content_compliant: true };
    try {
      const contentStr = await callGeminiAPI(
        "Analyze billboard image for compliance. Return JSON with obscene_detected (boolean), political_detected (boolean), content_compliant (boolean).",
        imageBase64
      );
      contentAnalysis = contentStr ? JSON.parse(contentStr) : contentAnalysis;
    } catch (err) {
      console.error("Content Analysis Error:", err);
    }

    // Structural analysis
    let structuralAnalysis = { structural_hazard: false };
    try {
      const structuralStr = await callGeminiAPI(
        "Analyze the billboard image for structural hazards (e.g., leaning, damaged supports). Return JSON with structural_hazard (boolean).",
        imageBase64
      );
      structuralAnalysis = structuralStr ? JSON.parse(structuralStr) : structuralAnalysis;
    } catch (err) {
      console.error("Structural Analysis Error:", err);
    }

    // Size analysis
    let sizeAnalysis = { size_appropriate: true, size_details: "Size appears standard" };
    try {
      const sizeStr = await callGeminiAPI(
        "Estimate billboard size from the image and determine if it's appropriate (e.g., not too small for visibility or too large for safety). Return JSON with size_appropriate (boolean), size_details (string).",
        imageBase64
      );
      sizeAnalysis = sizeStr ? JSON.parse(sizeStr) : sizeAnalysis;
    } catch (err) {
      console.error("Size Analysis Error:", err);
    }

    // Placement risk
    const placementRisk = latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude)) ? 0 : 1;

    // Calculate risk percentage
    const errors = [
      contentAnalysis.obscene_detected,
      contentAnalysis.political_detected,
      !contentAnalysis.content_compliant,
      structuralAnalysis.structural_hazard,
      !sizeAnalysis.size_appropriate,
      placementRisk,
    ];
    const riskPercentage = (errors.filter(Boolean).length / errors.length) * 100;
    const riskLevel = riskPercentage > 50 ? "High" : "Low";

    // Generate risk description
    const riskFactors = [];
    if (contentAnalysis.obscene_detected) riskFactors.push("Obscene content detected");
    if (contentAnalysis.political_detected) riskFactors.push("Political content detected");
    if (!contentAnalysis.content_compliant) riskFactors.push("Content not compliant with regulations");
    if (structuralAnalysis.structural_hazard) riskFactors.push("Structural hazard detected (e.g., leaning or damaged)");
    if (!sizeAnalysis.size_appropriate) riskFactors.push(`Inappropriate size: ${sizeAnalysis.size_details}`);
    if (placementRisk) riskFactors.push("Invalid or missing location data");

    const riskDescription = riskFactors.length > 0
      ? riskFactors.join("; ")
      : "No significant risks detected";

    return {
      extractedText,
      riskPercentage,
      riskLevel,
      riskDescription,
    };
  } catch (err) {
    console.error("Billboard Analysis Error:", err);
    return {
      extractedText: "",
      riskPercentage: 0,
      riskLevel: "Low",
      riskDescription: `Analysis failed: ${err.message}`,
    };
  }
}

// Route: Submit citizen report
router.post("/citizen-report", upload.array("photo", 5), async (req, res) => {
  try {
    // Log request payload
    console.log("Request payload:", {
      body: req.body,
      files: req.files?.map(f => f.filename),
    });

    // JWT Verification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ status: false, message: "Invalid token format" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secKey);
    } catch (err) {
      return res.status(403).json({ status: false, message: "Invalid or expired token" });
    }

    const citizenId = decoded.id;
    const { title, description, category, location, date, latitude, longitude } = req.body;

    // Validate required fields
    if (!title || !description || !category || !location) {
      return res.status(400).json({ status: false, message: "Missing required fields (title, description, category, location)" });
    }

    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: false, message: "No images uploaded" });
    }

    // Analyze images
    const analysisResults = [];
    for (const file of req.files) {
      const imagePath = path.join(UPLOAD_FOLDER, file.filename);
      if (!fs.existsSync(imagePath)) {
        console.error("Image not found:", imagePath);
        return res.status(400).json({ status: false, message: `Image file not found: ${file.filename}` });
      }
      const analysis = await analyzeBillboard(imagePath, description, parseFloat(latitude), parseFloat(longitude));
      if (analysis.mismatch) {
        return res.status(400).json({
          status: false,
          message: "Description and the images are different",
          details: {
            image: file.filename,
            extractedText: analysis.extractedText || "",
            mismatchDetails: analysis.mismatchDetails,
          },
        });
      }
      analysisResults.push({ image: file.filename, ...analysis });
    }

    // Insert report
    const reportQuery = `
      INSERT INTO reports (citizenId, title, description, category, location, date, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      citizenId,
      title,
      description,
      category,
      location,
      date || new Date().toISOString().split("T")[0],
      latitude || null,
      longitude || null,
    ];

    const reportResult = await new Promise((resolve, reject) => {
      connection.query(reportQuery, values, (err, result) => {
        if (err) {
          console.error("DB Insert Error:", err);
          reject(new Error("Database insert failed"));
        } else {
          resolve(result);
        }
      });
    });

    const reportId = reportResult.insertId;

    // Insert media
    const mediaValues = req.files.map(file => [
      reportId,
      `/uploads/${file.filename}`,
      file.mimetype.startsWith("image/") ? "image" : "video",
    ]);

    const mediaQuery = `INSERT INTO report_media (reportId, file_url, file_type) VALUES ?`;
    await new Promise((resolve, reject) => {
      connection.query(mediaQuery, [mediaValues], (err) => {
        if (err) {
          console.error("Media Insert Error:", err);
          reject(new Error("Media insert failed"));
        } else {
          resolve();
        }
      });
    });

    // Respond
    return res.status(201).json({
      status: true,
      message: "Report submitted successfully",
      reportId,
      title,
      risk_summary: analysisResults.map(result => ({
        image: result.image,
        riskPercentage: result.riskPercentage || 0,
        riskLevel: result.riskLevel || "Low",
        riskDescription: result.riskDescription || "No risks detected",
        extractedText: result.extractedText || "",
      })),
    });
  } catch (err) {
    console.error("Route Error:", err);
    return res.status(500).json({ status: false, message: "Server error during report submission" });
  }
});

export default router;