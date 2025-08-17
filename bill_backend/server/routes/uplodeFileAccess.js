import express from "express";
import jwt from "jsonwebtoken";
import { upload } from "../../uploads"; // Adjust path to your multer config
import connection from "../database/TestDb.js";

const router = express.Router();
const secKey = "billboard@2025";

// Upload route for report media
router.post("/upload", upload.array("image"), async (req, res) => {
  try {
    // Verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Invalid token format",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secKey);
    } catch (err) {
      return res.status(403).json({
        status: false,
        message: "Invalid or expired token",
      });
    }

    const citizenId = decoded.id;
    const { reportId } = req.body; // Expect reportId in the form data

    if (!reportId) {
      return res.status(400).json({
        status: false,
        message: "Report ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "No file uploaded",
      });
    }

    // Construct file URL
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype.startsWith("image") ? "image" : "video";

    // Verify report belongs to the citizen
    const reportCheckQuery = `
      SELECT id FROM reports WHERE id = ? AND citizenId = ?
    `;
    connection.query(reportCheckQuery, [reportId, citizenId], (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ status: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(403).json({
          status: false,
          message: "Report not found or unauthorized",
        });
      }

      // Insert into report_media
      const insertMediaQuery = `
        INSERT INTO report_media (reportId, file_url, file_type)
        VALUES (?, ?, ?)
      `;
      connection.query(
        insertMediaQuery,
        [reportId, fileUrl, fileType],
        (err, result) => {
          if (err) {
            console.error("DB Insert Error:", err);
            return res.status(500).json({ status: false, message: "Database error" });
          }

          res.status(200).json({
            status: true,
            mediaId: result.insertId,
            fileUrl,
          });
        }
      );
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({
      status: false,
      message: "Upload failed",
    });
  }
});

export default router;