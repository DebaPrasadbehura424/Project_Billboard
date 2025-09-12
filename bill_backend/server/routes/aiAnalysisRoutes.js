import express from "express";
import multer from "multer";
import getAiData from "../utils/getAiData.js";
import { analyzeBillboard } from "../controller/aiModelController.js";
import { classifyImage, loadModel } from "../model/model.js";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

//two option just change api and everything is work
//ai anaysis using gemini api
router.post("/gemini_analysis", upload.array("photo", 5), async (req, res) => {
  const { description, location, latitude, longitude } = req.body;

  if (
    !description ||
    !location ||
    !latitude ||
    !longitude ||
    !req.files?.length
  ) {
    return res
      .status(400)
      .json({ error: "Missing required fields or images." });
  }

  try {
    const results = await Promise.all(
      req.files.map(async (file) => {
        const imageBase64 = file.buffer.toString("base64");
        return await analyzeBillboard(
          imageBase64,
          description,
          latitude,
          longitude
        );
      })
    );

    const finalRisk = results.reduce(
      (acc, r) => (r.riskPercentage > acc.riskPercentage ? r : acc),
      { riskPercentage: 0 }
    );

    res.json({
      analyzedFiles: results.length,
      finalRisk,
      allResults: results,
    });
  } catch (err) {
    console.error("AI analysis error:", err);
    res.status(500).json({ error: err.message || "AI analysis failed" });
  }
});

// AI Analysis using own model
router.post("/analysis", upload.array("photo", 5), async (req, res) => {
  const { description, location, latitude, longitude } = req.body;

  if (
    !description ||
    !location ||
    !latitude ||
    !longitude ||
    !req.files?.length
  ) {
    return res
      .status(400)
      .json({ error: "Missing required fields or images." });
  }

  try {
    const results = await Promise.all(
      req.files.map(async (file) => {
        const predictions = await classifyImage(file.buffer);

        const top = predictions[0];
        const second = predictions[1] || { probability: 0 };

        const combinedProb = top.probability + second.probability;
        const riskPercentage = calculateRisk(combinedProb);
        const level = riskLevel(combinedProb);

        return {
          filename: file.originalname,
          label: top.className,
          confidence: Math.round(top.probability * 100),
          riskPercentage,
          riskLevel: level,
          reason: `Top: ${top.className} (${Math.round(
            top.probability * 100
          )}%), Next: ${second.className || "N/A"} (${Math.round(
            second.probability * 100
          )}%)`,
        };
      })
    );

    const finalRisk = results.reduce(
      (acc, r) => (r.riskPercentage > acc.riskPercentage ? r : acc),
      { riskPercentage: 0 }
    );
  } catch (err) {
    console.error("AI analysis error:", err);
    res.status(500).json({ error: err.message || "AI analysis failed" });
  }
});
function calculateRisk(prob) {
  return Math.round(20 + prob * 80);
}
function riskLevel(prob) {
  if (prob >= 0.75) return "High";
  if (prob >= 0.45) return "Medium";
  return "Low";
}

export default router;
