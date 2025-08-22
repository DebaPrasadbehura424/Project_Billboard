import express from "express";
import multer from "multer";
import getAiData from "../utils/getAiData.js";
import { analyzeBillboard } from "../controller/aiModelController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
        const imageBase64 = file.buffer.toString("base64");
        return await analyzeBillboard(
          imageBase64,
          description,
          coords.lat,
          coords.lng
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

export default router;
