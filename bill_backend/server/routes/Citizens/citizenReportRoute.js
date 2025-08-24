import express from "express";
import fs from "fs";
import multer from "multer";
import { analyzeBillboard } from "../../controller/aiModelController.js";
import connection from "../../database/TestDb.js";
const router = express.Router();

// Setup Multer (memory storage keeps file buffers in memory)
// Setup Multer (disk storage)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Helper: Convert [Object: null prototype] → normal object
function cleanBody(body) {
  return JSON.parse(JSON.stringify(body));
}

router.post("/analysis", upload.array("photo", 5), async (req, res) => {
  try {
    // Clean req.body
    const { title, description, location, latitude, longitude, date } =
      cleanBody(req.body);

    console.log("📩 Clean Body:", {
      title,
      description,
      location,
      latitude,
      longitude,
      date,
    });
    console.log("📸 Uploaded Files:", req.files?.length || 0);

    // Validation
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

    // Run analysis for each uploaded file
    const results = await Promise.all(
      req.files.map(async (file) => {
        const imageBuffer = fs.readFileSync(file.path);
        const imageBase64 = imageBuffer.toString("base64");
        return await analyzeBillboard(
          imageBase64,
          description,
          latitude,
          longitude
        );
      })
    );

    // Pick highest risk as final
    const finalRisk = results.reduce(
      (acc, r) => (r.riskPercentage > acc.riskPercentage ? r : acc),
      { riskPercentage: 0 }
    );

    res.json({
      finalRisk,
      allResults: results,
    });
  } catch (err) {
    console.error("🚨 Analysis route error:", err);
    res.status(500).json({ error: err.message || "AI analysis failed" });
  }
});

router.post("/citizen-report", upload.array("photo", 5), (req, res) => {
  try {
    const {
      citizenId,
      title,
      description,
      location,
      date,
      latitude,
      longitude,
      extractedText,
      category,
      riskLevel,
      riskPercentage,
      riskReason,
    } = req.body;

    if (!citizenId || !title || !description || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert report
    const reportQuery = `
      INSERT INTO reports (citizenId, title, category, location, description, date, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    connection.query(
      reportQuery,
      [
        citizenId,
        title,
        category,
        location,
        description,
        date,
        latitude || null,
        longitude || null,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting report:", err);
          return res.status(500).json({ error: "DB insert failed" });
        }

        const reportId = result.insertId;

        // Insert media files (save paths)
        if (req.files && req.files.length > 0) {
          req.files.forEach((file) => {
            const fileType = file.mimetype.startsWith("image")
              ? "image"
              : "video";
            const filePath = `uploads/${file.filename}`;

            const insertMedia = `
              INSERT INTO report_media (reportId, file_url, file_type)
              VALUES (?, ?, ?)
            `;
            connection.query(
              insertMedia,
              [reportId, filePath, fileType],
              (err2) => {
                if (err2) console.error("Error inserting media:", err2);
              }
            );
          });
        }

        // Insert AI Analysis
        const aiQuery = `
          INSERT INTO ai_analysis (reportId, extracted_text, risk_percentage, risk_level, risk_description, category)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        connection.query(
          aiQuery,
          [
            reportId,
            extractedText,
            riskPercentage,
            riskLevel,
            riskReason,
            category,
          ],
          (err3) => {
            if (err3) {
              console.error("Error inserting AI analysis:", err3);
              return res.status(500).json({ error: "AI insert failed" });
            }

            res.json({
              success: true,
              reportId,
              message: "Report, media & AI analysis saved successfully",
            });
          }
        );
      }
    );
  } catch (err) {
    console.error("Citizen Report Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
