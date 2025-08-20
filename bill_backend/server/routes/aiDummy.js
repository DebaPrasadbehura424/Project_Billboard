// import express from "express";
// import fs from "fs";
// import jwt from "jsonwebtoken";
// import fetch from "node-fetch";
// import path from "path";
// import { upload } from "../../../server/middleware/uplodeMiddleware.js";
// import connection from "../../database/TestDb.js";

// const router = express.Router();
// const secKey = "billboard@2025";
// const GOOGLE_API_KEY = "AIzaSyAcPAOnOtFt8zPOz6zLC0Sg0NTqpQQbOBg";

// // Helper: Convert image to base64 (byte format)
// function getImageBase64(imagePath) {
//   try {
//     if (!fs.existsSync(imagePath)) throw new Error("Image file not found");
//     const buffer = fs.readFileSync(imagePath);
//     const base64 = buffer.toString("base64");
//     console.log("Image converted to base64 for:", imagePath);
//     return base64;
//   } catch (err) {
//     console.error("Error reading image:", err);
//     throw new Error(Failed to read image: ${err.message});
//   }
// }

// // Helper: Call Gemini API (Fixed)
// async function callGeminiAPI(prompt, imageBase64 = null) {
//   try {
//     if (!GOOGLE_API_KEY) throw new Error("GOOGLE_API_KEY is not set");

//     const body = {
//       contents: [
//         {
//           parts: [
//             { text: prompt },
//             ...(imageBase64 ? [{ inlineData: { mimeType: "image/png", data: imageBase64 } }] : []),
//           ],
//         },
//       ],
//     };

//     const url = https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY};

//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error("Gemini API Error Response:", errorText);
//       throw new Error(Gemini API request failed: ${res.status} ${res.statusText});
//     }

//     const data = await res.json();
//     const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
//     if (!text) throw new Error("No text returned from Gemini API");

//     console.log("Gemini API Response:", text);
//     return text;
//   } catch (err) {
//     console.error("Gemini API Error:", err);
//     throw new Error(Gemini API failed: ${err.message});
//   }
// }

// // Helper: Analyze Category from Image
// async function analyzeCategory(imageBase64) {
//   try {
//     const prompt = `Analyze this billboard image and determine the main violation category.
//     Choose from these categories:
//     - "Structural Hazard" (damaged, leaning, unstable structure)
//     - "Content Violation" (obscene, inappropriate, or illegal content)
//     - "Size & Placement" (wrong size, obstructing traffic, blocking visibility)
//     - "Safety Hazard" (posing danger to public safety)
//     - "Regulatory Compliance" (violating advertising regulations)
//     - "Environmental Impact" (affecting environment or aesthetics)

//     Return ONLY the category name as a string.`;

//     const response = await callGeminiAPI(prompt, imageBase64);
//     // Clean up the response to get just the category name
//     const category = response.trim().replace(/["']/g, '');
//     console.log("AI Determined Category:", category);
//     return category;
//   } catch (err) {
//     console.error("Category Analysis Error:", err);
//     return "Safety Hazard"; // Default category
//   }
// }

// // Helper: Check for mismatch
// async function checkMismatch(extractedText, description) {
//   console.log("Checking mismatch:", { extractedText, description });

//   try {
//     const expectsSpecificText = description.toLowerCase().match(/says\s+['"]([^'"]+)['"]/i);

//     if (!extractedText && !expectsSpecificText) {
//       return {
//         mismatch: false,
//         mismatchDetails: "No text extracted, and description does not require specific text",
//       };
//     }

//     if (expectsSpecificText) {
//       const expectedText = expectsSpecificText[1].toLowerCase();
//       if (!extractedText || !extractedText.toLowerCase().includes(expectedText)) {
//         return {
//           mismatch: true,
//           mismatchDetails: Expected text "${expectedText}" not found in image. Found: "${extractedText}",
//         };
//       }
//     }

//     return {
//       mismatch: false,
//       mismatchDetails: "Text aligns with description",
//     };
//   } catch (err) {
//     console.error("Mismatch Check Error:", err);
//     return {
//       mismatch: false,
//       mismatchDetails: "Mismatch check failed, proceeding with analysis",
//     };
//   }
// }

// // Helper: Analyze Content (Obscene, Political, Compliance)
// async function analyzeContent(imageBase64) {
//   try {
//     const prompt = `Analyze this billboard image for:
//     1. Obscene or inappropriate content (obscene_detected: boolean)
//     2. Political content or messaging (political_detected: boolean)
//     3. Overall content compliance with advertising standards (content_compliant: boolean)

//     Return ONLY valid JSON: { "obscene_detected": boolean, "political_detected": boolean, "content_compliant": boolean }`;

//     const response = await callGeminiAPI(prompt, imageBase64);
//     const jsonMatch = response.match(/\{[\s\S]*\}/);
//     if (jsonMatch) {
//       return JSON.parse(jsonMatch[0]);
//     }
//     throw new Error("No JSON found in response");
//   } catch (err) {
//     console.error("Content Analysis Error:", err);
//     return { obscene_detected: false, political_detected: false, content_compliant: true };
//   }
// }

// // Helper: Analyze Structural Safety
// async function analyzeStructure(imageBase64) {
//   try {
//     const prompt = `Analyze this billboard structure for safety hazards:
//     1. Structural damage or deterioration (structural_damage: boolean)
//     2. Leaning or unstable appearance (leaning: boolean)
//     3. Missing or broken components (broken_parts: boolean)
//     4. Overall structural hazard (structural_hazard: boolean)

//     Return ONLY valid JSON: { "structural_damage": boolean, "leaning": boolean, "broken_parts": boolean, "structural_hazard": boolean }`;

//     const response = await callGeminiAPI(prompt, imageBase64);
//     const jsonMatch = response.match(/\{[\s\S]*\}/);
//     if (jsonMatch) {
//       return JSON.parse(jsonMatch[0]);
//     }
//     throw new Error("No JSON found in response");
//   } catch (err) {
//     console.error("Structural Analysis Error:", err);
//     return { structural_damage: false, leaning: false, broken_parts: false, structural_hazard: false };
//   }
// }

// // Helper: Analyze Size and Placement
// async function analyzeSizeAndPlacement(imageBase64, _latitude, _longitude) {
//   try {
//     const prompt = `Analyze this billboard for size and placement issues:
//     1. Is the size appropriate for the location? (size_appropriate: boolean)
//     2. Does it obstruct traffic signals or signs? (obstructs_traffic: boolean)
//     3. Does it block visibility for drivers or pedestrians? (blocks_visibility: boolean)
//     4. Is it too close to the road? (too_close_to_road: boolean)

//     Return detailed analysis with: { "size_appropriate": boolean, "obstructs_traffic": boolean, "blocks_visibility": boolean, "too_close_to_road": boolean, "size_details": string }`;

//     const response = await callGeminiAPI(prompt, imageBase64);
//     const jsonMatch = response.match(/\{[\s\S]*\}/);
//     if (jsonMatch) {
//       return JSON.parse(jsonMatch[0]);
//     }
//     throw new Error("No JSON found in response");
//   } catch (err) {
//     console.error("Size Analysis Error:", err);
//     return {
//       size_appropriate: true,
//       obstructs_traffic: false,
//       blocks_visibility: false,
//       too_close_to_road: false,
//       size_details: "Size analysis failed"
//     };
//   }
// }

// // Helper: Analyze billboard
// async function analyzeBillboard(imagePath, description, latitude, longitude) {
//   console.log("Starting comprehensive analysis for:", imagePath);

//   try {
//     const imageBase64 = getImageBase64(imagePath);

//     // Extract text
//     let extractedText = "";
//     try {
//       const extractionPrompt = "Extract all text visible in the billboard image. Return only the text exactly as it appears.";
//       extractedText = await callGeminiAPI(extractionPrompt, imageBase64);
//       console.log("Extracted text:", extractedText);
//     } catch (err) {
//       console.error("Text Extraction Error:", err);
//       extractedText = "";
//     }

//     // Check for mismatch
//     const mismatchInfo = await checkMismatch(extractedText, description);
//     if (mismatchInfo.mismatch) {
//       return { mismatch: true, mismatchDetails: mismatchInfo.mismatchDetails, extractedText };
//     }

//     // Analyze category from image
//     const aiCategory = await analyzeCategory(imageBase64);

//     // Run all analyses in parallel for better performance
//     const [contentAnalysis, structuralAnalysis, sizeAnalysis] = await Promise.all([
//       analyzeContent(imageBase64),
//       analyzeStructure(imageBase64),
//       analyzeSizeAndPlacement(imageBase64, latitude, longitude)
//     ]);

//     console.log("Content Analysis:", contentAnalysis);
//     console.log("Structural Analysis:", structuralAnalysis);
//     console.log("Size Analysis:", sizeAnalysis);

//     // Placement risk
//     const placementRisk = latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude)) ? 0 : 1;

//     // Calculate risk percentage based on actual image analysis
//     const errors = [
//       contentAnalysis.obscene_detected,
//       contentAnalysis.political_detected,
//       !contentAnalysis.content_compliant,
//       structuralAnalysis.structural_hazard,
//       structuralAnalysis.structural_damage,
//       structuralAnalysis.leaning,
//       structuralAnalysis.broken_parts,
//       !sizeAnalysis.size_appropriate,
//       sizeAnalysis.obstructs_traffic,
//       sizeAnalysis.blocks_visibility,
//       sizeAnalysis.too_close_to_road,
//       placementRisk,
//     ];

//     const riskPercentage = Math.min((errors.filter(Boolean).length / errors.length) * 100, 100);
//     const riskLevel = riskPercentage > 70 ? "High" : riskPercentage > 40 ? "Medium" : "Low";

//     // Generate detailed risk description based on actual findings
//     const riskFactors = [];

//     // Content risks
//     if (contentAnalysis.obscene_detected) riskFactors.push("Obscene or inappropriate content detected");
//     if (contentAnalysis.political_detected) riskFactors.push("Political content detected");
//     if (!contentAnalysis.content_compliant) riskFactors.push("Content violates advertising standards");

//     // Structural risks
//     if (structuralAnalysis.structural_hazard) riskFactors.push("Major structural hazard detected");
//     if (structuralAnalysis.structural_damage) riskFactors.push("Structural damage visible");
//     if (structuralAnalysis.leaning) riskFactors.push("Billboard appears to be leaning");
//     if (structuralAnalysis.broken_parts) riskFactors.push("Broken or missing components");

//     // Size and placement risks
//     if (!sizeAnalysis.size_appropriate) riskFactors.push("Inappropriate size for location");
//     if (sizeAnalysis.obstructs_traffic) riskFactors.push("Obstructs traffic signals or signs");
//     if (sizeAnalysis.blocks_visibility) riskFactors.push("Blocks visibility for drivers/pedestrians");
//     if (sizeAnalysis.too_close_to_road) riskFactors.push("Too close to the road, posing safety risk");
//     if (placementRisk) riskFactors.push("Invalid or missing location coordinates");

//     const riskDescription = riskFactors.length > 0
//       ? riskFactors.join("; ")
//       : "No significant risks detected. Billboard appears compliant and safe";

//     console.log("Comprehensive analysis completed:", {
//       extractedText,
//       riskPercentage,
//       riskLevel,
//       riskDescription,
//       aiCategory
//     });

//     return {
//       extractedText,
//       riskPercentage,
//       riskLevel,
//       riskDescription,
//       aiCategory,
//       contentAnalysis,
//       structuralAnalysis,
//       sizeAnalysis
//     };
//   } catch (err) {
//     console.error("Billboard Analysis Error:", err);
//     return {
//       extractedText: "",
//       riskPercentage: 25,
//       riskLevel: "Medium",
//       riskDescription: Analysis failed: ${err.message}. Manual inspection recommended.,
//       aiCategory: "Safety Hazard"
//     };
//   }
// }

// // Test route for Gemini API
// router.get("/test-gemini", async (_req, res) => {
//   try {
//     const testPrompt = "Hello, are you working? Respond with 'Yes, I am working'";
//     const response = await callGeminiAPI(testPrompt);
//     res.json({ success: true, response });
//   } catch (error) {
//     res.json({ success: false, error: error.message });
//   }
// });

// // Route: Submit citizen report
// router.post("/citizen-report", upload.array("photo", 5), async (req, res) => {
//   try {
//     // JWT Verification
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ status: false, message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     let decoded;
//     try {
//       decoded = jwt.verify(token, secKey);
//     } catch (err) {
//       return res.status(403).json({ status: false, message: "Invalid or expired token" });
//     }

//     const citizenId = decoded.id;
//     const { title, description, location, date, latitude, longitude } = req.body;

//     // Validate required fields (removed category validation)
//     if (!title || !description || !location) {
//       return res.status(400).json({ status: false, message: "Missing required fields (title, description, location)" });
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ status: false, message: "No images uploaded" });
//     }

//     // Analyze images
//     const analysisResults = [];
//     for (const file of req.files) {
//       const filePath = path.join("./uploads", file.filename);
//       const analysis = await analyzeBillboard(
//         filePath,
//         description,
//         parseFloat(latitude),
//         parseFloat(longitude)
//       );

//       if (analysis.mismatch) {
//         return res.status(400).json({
//           status: false,
//           message: "Description and image content mismatch",
//           details: {
//             image: file.filename,
//             extractedText: analysis.extractedText,
//             mismatchDetails: analysis.mismatchDetails,
//           },
//         });
//       }
//       analysisResults.push({ image: file.filename, ...analysis });
//     }

//     // Use AI-determined category from the first image analysis
//     const aiCategory = analysisResults[0]?.aiCategory || "Safety Hazard";

//     // Insert report with AI-determined category
//     const reportQuery = `
//       INSERT INTO reports (citizenId, title, description, category, location, date, latitude, longitude)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//     const values = [
//       citizenId,
//       title,
//       description,
//       aiCategory, // Use AI-determined category instead of user input
//       location,
//       date || new Date().toISOString().split("T")[0],
//       latitude || null,
//       longitude || null,
//     ];

//     const reportResult = await new Promise((resolve, reject) => {
//       connection.query(reportQuery, values, (err, result) => {
//         if (err) reject(new Error("Database insert failed"));
//         else resolve(result);
//       });
//     });

//     const reportId = reportResult.insertId;

//     // Insert media
//     const mediaValues = req.files.map(file => [
//       reportId,
//       /uploads/${file.filename},
//       file.mimetype.startsWith("image/") ? "image" : "video",
//     ]);

//     const mediaQuery = INSERT INTO report_media (reportId, file_url, file_type) VALUES ?;
//     await new Promise((resolve, reject) => {
//       connection.query(mediaQuery, [mediaValues], (err) => {
//         if (err) reject(new Error("Media insert failed"));
//         else resolve();
//       });
//     });

//     // Respond with detailed analysis
//     return res.status(201).json({
//       status: true,
//       message: "Report submitted successfully",
//       reportId,
//       title,
//       aiDeterminedCategory: aiCategory,
//       risk_summary: analysisResults.map(result => ({
//         image: result.image,
//         extractedText: result.extractedText,
//         riskPercentage: Math.round(result.riskPercentage),
//         riskLevel: result.riskLevel,
//         riskDescription: result.riskDescription,
//         contentIssues: result.contentAnalysis,
//         structuralIssues: result.structuralAnalysis,
//         placementIssues: result.sizeAnalysis
//       })),
//     });
//   } catch (err) {
//     console.error("Route Error:", err);
//     return res.status(500).json({ status: false, message: "Server error during report submission" });
//   }
// });

// export default router;
