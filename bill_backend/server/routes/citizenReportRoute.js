import express from "express";
import jwt from "jsonwebtoken";
import connection from "../database/TestDb.js";
import { upload } from "../middleware/uplodeMiddleware.js";

const route = express.Router();

const secKey = "billboard@2025";

route.post("/citizen-report", upload.array("photo", 5), async (req, res) => {
  try {
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
    const { title, description, category, location, date } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }


    //insert report
    const reportQuery = `
      INSERT INTO reports (citizenId, title, description, category, location, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [citizenId, title, description, category, location, date || new Date()];

    connection.query(reportQuery, values, (err, result) => {
      if (err) {
        console.error("DB Insert Error:", err);
        return res.status(500).json({ status: false, message: "Database insert failed" });
      }

      const reportId = result.insertId;

    //   insert uplode file
      if (req.files && req.files.length > 0) {
        const mediaValues = req.files.map((file) => [
          reportId,
          `/uploads/${file.filename}`,
          file.mimetype.startsWith("image/") ? "image" : "video",
        ]);

        const mediaQuery = `INSERT INTO report_media (reportId, file_url, file_type) VALUES ?`;

        connection.query(mediaQuery, [mediaValues], (err2) => {
          if (err2) {
            console.error("Media Insert Error:", err2);
            return res.status(500).json({ status: false, message: "Media insert failed" });
          }
        });
      }

      return res.status(201).json({
        status: true,
        message: "Report submitted successfully",
        reportId,
      });
    });
  } catch (err) {
    console.error("Route Error:", err);
    return res.status(500).json({ status: false, message: "Router error in citizen..." });
  }
});

export default route;
