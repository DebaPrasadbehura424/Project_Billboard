import express from "express";
import jwt from "jsonwebtoken";
import connection from "../../database/TestDb.js";

const router = express.Router();

// Use env vars for secrets in real apps!
const USER_SECRET = "billboard@2025";
const AUTHORITY_SECRET = "authorityBillboard@2025";

// Middleware for verifying either user or authority token
const verifyToken = (req, res, next) => {
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

  try {
    // First try user token
    req.user = jwt.verify(token, USER_SECRET);
    req.role = "user";
    return next();
  } catch (errUser) {
    try {
      // If not user, try authority token
      req.user = jwt.verify(token, AUTHORITY_SECRET);
      req.role = "authority";
      return next();
    } catch (errAuth) {
      return res.status(403).json({
        status: false,
        message: "Invalid or expired token",
      });
    }
  }
};

// =============================
// Fetch citizen's reports
// =============================
router.get("/auth-reporting", verifyToken, async (req, res) => {
  try {
    const citizenId = req.user.id;

    const reportsQuery = `
      SELECT 
        r.id AS reportId,
        r.title,
        r.description,
        r.category,
        r.location,
        r.latitude,
        r.longitude,
        r.date,
        r.status,
        u.id AS userId,
        u.name AS userName,
        m.id AS mediaId,
        m.file_url,
        m.file_type
      FROM reports r
      JOIN userAuth u ON r.citizenId = u.id
      LEFT JOIN report_media m ON r.id = m.reportId
      WHERE r.citizenId = ?
      ORDER BY r.date DESC, m.uploadedAt ASC
    `;

    connection.query(reportsQuery, [citizenId], (err, results) => {
      if (err) {
        console.error("DB Fetch Error:", err);
        return res
          .status(500)
          .json({ status: false, message: "Database error" });
      }

      const reports = [];
      const map = new Map();

      results.forEach((row) => {
        if (!map.has(row.reportId)) {
          const report = {
            reportId: row.reportId,
            title: row.title,
            description: row.description,
            category: row.category,
            location: row.location,
            latitude: row.latitude,
            longitude: row.longitude,
            date: row.date,
            status: row.status,
            userId: row.userId,
            userName: row.userName,
            media: [],
          };
          reports.push(report);
          map.set(row.reportId, report);
        }
        if (row.mediaId) {
          map.get(row.reportId).media.push({
            mediaId: row.mediaId,
            url: row.file_url,
            type: row.file_type,
          });
        }
      });

      return res.status(200).json({ status: true, reports, role: req.role });
    });
  } catch (err) {
    console.error("Route Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

// =============================
// Fetch single report by ID
// =============================
router.get("/report/:reportId", verifyToken, async (req, res) => {
  try {
    const citizenId = req.user.id;
    const reportId = req.params.reportId;

    const reportQuery = `
      SELECT 
        r.id AS reportId,
        r.title,
        r.description,
        r.category,
        r.location,
        r.latitude,
        r.longitude,
        r.date,
        r.status,
        u.id AS userId,
        u.name AS userName,
        m.id AS mediaId,
        m.file_url,
        m.file_type
      FROM reports r
      JOIN userAuth u ON r.citizenId = u.id
      LEFT JOIN report_media m ON r.id = m.reportId
      WHERE r.id = ? AND r.citizenId = ?
      ORDER BY m.uploadedAt ASC
    `;

    connection.query(reportQuery, [reportId, citizenId], (err, results) => {
      if (err) {
        console.error("DB Fetch Error:", err);
        return res
          .status(500)
          .json({ status: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Report not found or unauthorized",
        });
      }

      const report = {
        reportId: results[0].reportId,
        title: results[0].title,
        description: results[0].description,
        category: results[0].category,
        location: results[0].location,
        latitude: results[0].latitude,
        longitude: results[0].longitude,
        date: results[0].date,
        status: results[0].status,
        userId: results[0].userId,
        userName: results[0].userName,
        media: [],
      };

      results.forEach((row) => {
        if (row.mediaId) {
          report.media.push({
            mediaId: row.mediaId,
            url: row.file_url,
            type: row.file_type,
          });
        }
      });

      return res.status(200).json({ status: true, report, role: req.role });
    });
  } catch (err) {
    console.error("Route Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

export default router;
