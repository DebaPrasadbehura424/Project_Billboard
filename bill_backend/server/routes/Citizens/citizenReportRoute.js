import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import path from "path";
import { upload } from "../../../server/middleware/uplodeMiddleware.js";
import connection from "../../database/TestDb.js";

const router = express.Router();
const secKey = "billboard@2025";
const GOOGLE_API_KEY = "AIzaSyA1Oix6Ct3tikygJuSxpmxvPiNUs40fJGM";

// Enhanced image processing
function getImageBase64(imagePath) {
  try {
    const absolutePath = path.resolve(imagePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Image not found: ${absolutePath}`);
    }
    
    const buffer = fs.readFileSync(absolutePath);
    if (buffer.length === 0) {
      throw new Error("Empty image file");
    }
    
    const ext = path.extname(absolutePath).toLowerCase();
    let mimeType = "image/jpeg";
    if (ext === '.png') mimeType = "image/png";
    else if (ext === '.gif') mimeType = "image/gif";
    else if (ext === '.webp') mimeType = "image/webp";
    
    const base64 = buffer.toString("base64");
    return { base64, mimeType };
  } catch (err) {
    console.error("Image processing error:", err.message);
    throw new Error(`Failed to process image: ${err.message}`);
  }
}

// Enhanced Gemini API call
async function callGeminiAPI(prompt, imageData = null, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!GOOGLE_API_KEY) throw new Error("GOOGLE_API_KEY is not set");
      
      const requestBody = {
        contents: [{
          parts: [
            { text: prompt },
            ...(imageData ? [{
              inlineData: {
                mimeType: imageData.mimeType,
                data: imageData.base64
              }
            }] : [])
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          topP: 0.8,
          topK: 40,
        }
      };

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        timeout: 30000
      });

      if (!response.ok) {
        if (response.status === 429 && attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        throw new Error(`API error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) throw new Error("No text in response");
      
      return text;
      
    } catch (err) {
      console.error(`Gemini API attempt ${attempt} failed:`, err.message);
      if (attempt === retries) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Check if image contains a billboard
async function checkForBillboard(imageData) {
  try {
    const prompt = `Does this image contain a billboard or outdoor advertising sign? 
    Respond with ONLY JSON: {"billboard_detected": true, "confidence": 0-100} or {"billboard_detected": false, "confidence": 0-100}`;
    
    const response = await callGeminiAPI(prompt, imageData);
    
    // Attempt to parse response as JSON
    let result;
    try {
      result = JSON.parse(response);
    } catch (parseErr) {
      console.warn("Gemini API response is not valid JSON, falling back to text parsing:", response);
      // Fallback to text-based parsing
      const billboardDetected = response.toLowerCase().includes("true") || 
                               response.toLowerCase().includes("yes");
      const confidenceMatch = response.match(/"confidence":\s*(\d+)/);
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 
                        (billboardDetected ? 80 : 20);
      
      return {
        billboard_detected: billboardDetected,
        confidence: Math.min(Math.max(confidence, 0), 100)
      };
    }

    // Validate JSON response
    if (typeof result.billboard_detected !== 'boolean' || typeof result.confidence !== 'number') {
      throw new Error("Invalid response format from Gemini API");
    }

    return {
      billboard_detected: result.billboard_detected,
      confidence: Math.min(Math.max(result.confidence, 0), 100)
    };
  } catch (err) {
    console.error("Billboard detection failed:", err.message);
    return { billboard_detected: false, confidence: 0 };
  }
}

// Enhanced analysis functions
async function analyzeContent(imageData) {
  try {
    const prompt = `Analyze this billboard image for content violations. Return ONLY JSON:
{
  "obscene_detected": true/false,
  "political_detected": true/false, 
  "content_compliant": true/false
}`;
    
    const response = await callGeminiAPI(prompt, imageData);
    
    // Simple text-based parsing
    const obsceneDetected = response.toLowerCase().includes("true") || 
                           response.toLowerCase().includes("obscene") || 
                           response.toLowerCase().includes("inappropriate");
    const politicalDetected = response.toLowerCase().includes("true") || 
                             response.toLowerCase().includes("political");
    
    return {
      obscene_detected: obsceneDetected,
      political_detected: politicalDetected,
      content_compliant: !obsceneDetected && !politicalDetected
    };
  } catch (err) {
    console.error("Content analysis failed:", err.message);
    return { obscene_detected: false, political_detected: false, content_compliant: true };
  }
}

async function analyzeStructure(imageData) {
  try {
    const prompt = `Analyze this billboard structure for safety issues. Return ONLY JSON:
{
  "structural_damage": true/false,
  "leaning": true/false,
  "broken_parts": true/false,
  "structural_hazard": true/false
}`;
    
    const response = await callGeminiAPI(prompt, imageData);
    
    // Simple text-based parsing
    const structuralHazard = response.toLowerCase().includes("true") || 
                           response.toLowerCase().includes("damage") || 
                           response.toLowerCase().includes("leaning") ||
                           response.toLowerCase().includes("broken") ||
                           response.toLowerCase().includes("hazard");
    
    return {
      structural_damage: structuralHazard,
      leaning: response.toLowerCase().includes("leaning"),
      broken_parts: response.toLowerCase().includes("broken"),
      structural_hazard: structuralHazard
    };
  } catch (err) {
    console.error("Structure analysis failed:", err.message);
    return { structural_damage: false, leaning: false, broken_parts: false, structural_hazard: false };
  }
}

async function analyzeSizeAndPlacement(imageData) {
  try {
    const prompt = `Analyze this billboard size and placement issues. Return ONLY JSON:
{
  "size_appropriate": true/false,
  "obstructs_traffic": true/false, 
  "blocks_visibility": true/false,
  "too_close_to_road": true/false
}`;
    
    const response = await callGeminiAPI(prompt, imageData);
    
    // Simple text-based parsing
    const obstructsTraffic = response.toLowerCase().includes("true") || 
                           response.toLowerCase().includes("obstruct") || 
                           response.toLowerCase().includes("traffic");
    const blocksVisibility = response.toLowerCase().includes("true") || 
                           response.toLowerCase().includes("visibility") || 
                           response.toLowerCase().includes("block");
    
    return {
      size_appropriate: !response.toLowerCase().includes("size"),
      obstructs_traffic: obstructsTraffic,
      blocks_visibility: blocksVisibility,
      too_close_to_road: response.toLowerCase().includes("close") || 
                         response.toLowerCase().includes("road")
    };
  } catch (err) {
    console.error("Size analysis failed:", err.message);
    return { 
      size_appropriate: true, 
      obstructs_traffic: false, 
      blocks_visibility: false, 
      too_close_to_road: false
    };
  }
}

// Determine category based on analysis results
function determineCategory(contentAnalysis, structuralAnalysis, sizeAnalysis) {
  if (structuralAnalysis.structural_hazard) {
    return "Structural Hazard";
  }
  if (!contentAnalysis.content_compliant || contentAnalysis.obscene_detected || contentAnalysis.political_detected) {
    return "Content Violation";
  }
  if (sizeAnalysis.obstructs_traffic || sizeAnalysis.blocks_visibility || sizeAnalysis.too_close_to_road) {
    return "Size & Placement";
  }
  if (!sizeAnalysis.size_appropriate) {
    return "Regulatory Compliance";
  }
  
  return "Safety Hazard";
}

// Enhanced risk calculation
function calculateOverallRisk(contentAnalysis, structuralAnalysis, sizeAnalysis) {
  const riskFactors = [
    { risk: contentAnalysis.obscene_detected, weight: 0.4, severity: 0.9 },
    { risk: contentAnalysis.political_detected, weight: 0.4, severity: 0.7 },
    { risk: !contentAnalysis.content_compliant, weight: 0.4, severity: 0.8 },
    { risk: structuralAnalysis.structural_hazard, weight: 0.35, severity: 1.0 },
    { risk: structuralAnalysis.structural_damage, weight: 0.35, severity: 0.8 },
    { risk: structuralAnalysis.leaning, weight: 0.35, severity: 0.7 },
    { risk: structuralAnalysis.broken_parts, weight: 0.35, severity: 0.6 },
    { risk: !sizeAnalysis.size_appropriate, weight: 0.25, severity: 0.5 },
    { risk: sizeAnalysis.obstructs_traffic, weight: 0.25, severity: 0.9 },
    { risk: sizeAnalysis.blocks_visibility, weight: 0.25, severity: 0.8 },
    { risk: sizeAnalysis.too_close_to_road, weight: 0.25, severity: 0.7 }
  ];

  let totalWeightedRisk = 0;
  let totalWeight = 0;

  riskFactors.forEach(factor => {
    if (factor.risk) {
      totalWeightedRisk += factor.weight * factor.severity;
      totalWeight += factor.weight;
    }
  });

  if (totalWeight === 0) {
    return { riskPercentage: 10, riskLevel: "Minimal" };
  }

  const weightedAverage = totalWeightedRisk / totalWeight;
  const riskPercentage = Math.min(Math.round(weightedAverage * 100), 100);
  
  let riskLevel;
  if (riskPercentage >= 80) riskLevel = "Critical";
  else if (riskPercentage >= 60) riskLevel = "High";
  else if (riskPercentage >= 40) riskLevel = "Medium";
  else if (riskPercentage >= 20) riskLevel = "Low";
  else riskLevel = "Minimal";

  return { riskPercentage, riskLevel };
}

// Enhanced multi-image analysis
async function analyzeMultipleImages(imagePaths) {
  const allResults = [];
  const invalidImages = [];

  for (const imagePath of imagePaths) {
    try {
      const imageData = getImageBase64(imagePath);
      
      // Check if this image contains a billboard
      const billboardCheck = await checkForBillboard(imageData);
      
      if (!billboardCheck.billboard_detected || billboardCheck.confidence < 60) {
        allResults.push({
          image: path.basename(imagePath),
          error: "No billboard detected in image",
          billboardConfidence: billboardCheck.confidence,
          riskPercentage: 0,
          riskLevel: "No Billboard",
          category: "No Billboard"
        });
        invalidImages.push(path.basename(imagePath));
        continue;
      }

      // Run analyses in parallel
      const [content, structure, size] = await Promise.all([
        analyzeContent(imageData),
        analyzeStructure(imageData),
        analyzeSizeAndPlacement(imageData)
      ]);

      // Calculate risk for this image
      const { riskPercentage, riskLevel } = calculateOverallRisk(content, structure, size);
      
      // Determine category for this image
      const category = determineCategory(content, structure, size);
      
      allResults.push({
        image: path.basename(imagePath),
        billboardConfidence: billboardCheck.confidence,
        contentAnalysis: content,
        structuralAnalysis: structure,
        sizeAnalysis: size,
        riskPercentage,
        riskLevel,
        category
      });

    } catch (err) {
      console.error(`Failed to analyze ${imagePath}:`, err.message);
      allResults.push({
        image: path.basename(imagePath),
        error: err.message,
        riskPercentage: 0,
        riskLevel: "Analysis Failed",
        category: "Analysis Failed"
      });
      invalidImages.push(path.basename(imagePath));
    }
  }

  return { allResults, invalidImages };
}

// Enhanced main analysis function
async function analyzeBillboardReport(imagePaths) {
  console.log("Starting analysis of", imagePaths.length, "images...");
  
  try {
    // Analyze all images
    const { allResults, invalidImages } = await analyzeMultipleImages(imagePaths);
    
    // If any images are invalid (no billboard or analysis failed), reject the request
    if (invalidImages.length > 0) {
      return {
        noBillboard: true,
        message: `The following images do not contain a billboard or failed analysis: ${invalidImages.join(', ')}. Please upload images that clearly show a billboard.`,
        allResults
      };
    }

    // Calculate average risk across all valid images
    const totalRisk = allResults.reduce((sum, result) => sum + result.riskPercentage, 0);
    const averageRisk = Math.round(totalRisk / allResults.length);
    
    // Determine overall risk level
    let overallRiskLevel;
    if (averageRisk >= 80) overallRiskLevel = "Critical";
    else if (averageRisk >= 60) overallRiskLevel = "High";
    else if (averageRisk >= 40) overallRiskLevel = "Medium";
    else if (averageRisk >= 20) overallRiskLevel = "Low";
    else overallRiskLevel = "Minimal";

    // Determine overall category based on highest priority issue
    let overallCategory = "Safety Hazard";
    const hasStructuralHazard = allResults.some(result => 
      result.structuralAnalysis?.structural_hazard
    );
    const hasContentViolation = allResults.some(result => 
      !result.contentAnalysis?.content_compliant || 
      result.contentAnalysis?.obscene_detected || 
      result.contentAnalysis?.political_detected
    );
    const hasSizePlacementIssue = allResults.some(result => 
      result.sizeAnalysis?.obstructs_traffic || 
      result.sizeAnalysis?.blocks_visibility || 
      result.sizeAnalysis?.too_close_to_road
    );
    
    if (hasStructuralHazard) {
      overallCategory = "Structural Hazard";
    } else if (hasContentViolation) {
      overallCategory = "Content Violation";
    } else if (hasSizePlacementIssue) {
      overallCategory = "Size & Placement";
    } else if (allResults.some(result => !result.sizeAnalysis?.size_appropriate)) {
      overallCategory = "Regulatory Compliance";
    }

    // Generate risk description
    const riskFactors = [];
    allResults.forEach(result => {
      if (result.contentAnalysis?.obscene_detected) riskFactors.push("Inappropriate content");
      if (result.contentAnalysis?.political_detected) riskFactors.push("Political content");
      if (result.structuralAnalysis?.structural_hazard) riskFactors.push("Structural hazards");
      if (result.sizeAnalysis?.obstructs_traffic) riskFactors.push("Traffic obstruction");
      if (result.sizeAnalysis?.blocks_visibility) riskFactors.push("Visibility issues");
    });

    const uniqueRiskFactors = [...new Set(riskFactors)];
    const riskDescription = uniqueRiskFactors.length > 0 
      ? `Detected issues: ${uniqueRiskFactors.join(', ')}` 
      : "No critical safety issues detected";

    console.log("Analysis completed. Overall Risk:", averageRisk + "%", overallRiskLevel, "Category:", overallCategory);
    
    return {
      noBillboard: false,
      allResults,
      overallAnalysis: {
        riskPercentage: averageRisk,
        riskLevel: overallRiskLevel,
        riskDescription,
        category: overallCategory
      }
    };

  } catch (err) {
    console.error("Comprehensive analysis failed:", err.message);
    return {
      noBillboard: false,
      allResults: [],
      overallAnalysis: {
        riskPercentage: 0,
        riskLevel: "Analysis Failed",
        riskDescription: "Analysis temporarily unavailable",
        category: "Safety Hazard"
      }
    };
  }
}

// Enhanced citizen report route
router.post("/citizen-report", upload.array("photo", 5), async (req, res) => {
  let reportId = null;
  
  try {
    // JWT verification
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ status: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, secKey);
    } catch (err) {
      return res.status(403).json({ status: false, message: "Invalid or expired token" });
    }

    const citizenId = decoded.id;
    const { title, description, location, date, latitude, longitude } = req.body;

    // Validation
    if (!title || !location || !req.files?.length) {
      return res.status(400).json({ 
        status: false, 
        message: "Missing required fields: title, location, or images" 
      });
    }

    // Prepare image paths
    const imagePaths = req.files.map(file => path.join("./uploads", file.filename));
    
    // Analyze all images for errors/risks
    const analysisResult = await analyzeBillboardReport(imagePaths);

    if (analysisResult.noBillboard) {
      // Delete uploaded files to prevent storage of invalid images
      for (const imagePath of imagePaths) {
        try {
          fs.unlinkSync(imagePath);
          console.log(`Deleted invalid image: ${imagePath}`);
        } catch (unlinkErr) {
          console.error(`Failed to delete image ${imagePath}:`, unlinkErr.message);
        }
      }
      return res.status(400).json({
        status: false,
        message: analysisResult.message,
        details: "Please upload images that clearly show a billboard",
        invalidImages: analysisResult.allResults
          .filter(r => r.error || r.riskLevel === "No Billboard")
          .map(r => ({ image: r.image, error: r.error || "No billboard detected" }))
      });
    }

    // Test database connection
    console.log("Testing database connection...");
    await new Promise((resolve, reject) => {
      connection.query("SELECT 1", (err) => {
        if (err) {
          console.error("Database connection failed:", err);
          reject(new Error("Database connection failed"));
        } else {
          console.log("Database connection successful");
          resolve();
        }
      });
    });

    // Insert report with category from AI analysis
    const reportQuery = `
      INSERT INTO reports (citizenId, title, description, category, location, date, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      citizenId,
      title,
      description || "",
      analysisResult.overallAnalysis.category,
      location,
      date || new Date().toISOString().split("T")[0],
      latitude || null,
      longitude || null,
    ];

    console.log("Inserting report with values:", values);
    
    const reportResult = await new Promise((resolve, reject) => {
      connection.query(reportQuery, values, (err, result) => {
        if (err) {
          console.error("Report insertion error:", err);
          reject(new Error("Database insert failed: " + err.message));
        } else {
          console.log("Report inserted successfully, ID:", result.insertId);
          resolve(result);
        }
      });
    });

    reportId = reportResult.insertId;

    // Insert media
    const mediaValues = req.files.map(file => [
      reportId,
      `/uploads/${file.filename}`,
      file.mimetype.startsWith("image/") ? "image" : "video",
    ]);

    console.log("Inserting media with values:", mediaValues);
    
    await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO report_media (reportId, file_url, file_type) VALUES ?",
        [mediaValues],
        (err, result) => {
          if (err) {
            console.error("Media insertion error:", err);
            reject(new Error("Media insert failed: " + err.message));
          } else {
            console.log("Media inserted successfully, affected rows:", result.affectedRows);
            resolve(result);
          }
        }
      );
    });

    // Store AI analysis
    const analysisQuery = `
      INSERT INTO ai_analysis (
        reportId, risk_percentage, risk_level, risk_description, category,
        obscene_detected, political_detected, content_compliant,
        structural_damage, leaning, broken_parts, structural_hazard,
        size_appropriate, obstructs_traffic, blocks_visibility, too_close_to_road
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const firstValidResult = analysisResult.allResults[0];

    const analysisValues = [
      reportId,
      analysisResult.overallAnalysis.riskPercentage,
      analysisResult.overallAnalysis.riskLevel,
      analysisResult.overallAnalysis.riskDescription,
      analysisResult.overallAnalysis.category,
      firstValidResult.contentAnalysis?.obscene_detected ? 1 : 0,
      firstValidResult.contentAnalysis?.political_detected ? 1 : 0,
      firstValidResult.contentAnalysis?.content_compliant ? 1 : 0,
      firstValidResult.structuralAnalysis?.structural_damage ? 1 : 0,
      firstValidResult.structuralAnalysis?.leaning ? 1 : 0,
      firstValidResult.structuralAnalysis?.broken_parts ? 1 : 0,
      firstValidResult.structuralAnalysis?.structural_hazard ? 1 : 0,
      firstValidResult.sizeAnalysis?.size_appropriate ? 1 : 0,
      firstValidResult.sizeAnalysis?.obstructs_traffic ? 1 : 0,
      firstValidResult.sizeAnalysis?.blocks_visibility ? 1 : 0,
      firstValidResult.sizeAnalysis?.too_close_to_road ? 1 : 0
    ];

    console.log("Inserting AI analysis with values:", analysisValues);
    
    await new Promise((resolve) => {
      connection.query(analysisQuery, analysisValues, (err, result) => {
        if (err) {
          console.error("AI analysis insertion error:", err);
          console.log("AI analysis storage failed, but continuing");
        } else {
          console.log("AI analysis inserted successfully, affected rows:", result.affectedRows);
        }
        resolve();
      });
    });

    // Response
    return res.status(201).json({
      status: true,
      message: "Report submitted successfully",
      reportId,
      title,
      aiDeterminedCategory: analysisResult.overallAnalysis.category,
      riskSummary: {
        overallRisk: analysisResult.overallAnalysis.riskPercentage,
        riskLevel: analysisResult.overallAnalysis.riskLevel,
        riskDescription: analysisResult.overallAnalysis.riskDescription
      },
      imageCount: analysisResult.allResults.length
    });

  } catch (err) {
    console.error("Report submission error:", err.message);
    
    // Clean up uploaded files on error
    if (req.files?.length) {
      for (const file of req.files) {
        try {
          fs.unlinkSync(path.join("./uploads", file.filename));
          console.log(`Deleted file due to error: ${file.filename}`);
        } catch (unlinkErr) {
          console.error(`Failed to delete file ${file.filename}:`, unlinkErr.message);
        }
      }
    }

    // Clean up database if report was created
    if (reportId) {
      try {
        await new Promise((resolve) => {
          connection.query("DELETE FROM reports WHERE id = ?", [reportId], (err) => {
            if (err) console.error("Failed to clean up report:", err);
            else console.log("Cleaned up incomplete report:", reportId);
            resolve();
          });
        });
      } catch (cleanupError) {
        console.error("Cleanup failed:", cleanupError.message);
      }
    }
    
    return res.status(500).json({ 
      status: false, 
      message: "Server error during submission: " + err.message 
    });
  }
});

export default router;