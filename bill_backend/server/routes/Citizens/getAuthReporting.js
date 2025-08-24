import express from "express";
import jwt from "jsonwebtoken";
import connection from "../../database/TestDb.js";

const router = express.Router();

// Use env vars in production
const USER_SECRET = "billboard@2025";
const AUTHORITY_SECRET = "authorityBillboard@2025";

/** Build absolute base URL from request (http/https + host) */
const getBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

/** Ensure media URL is absolute (maps "uploads/xyz.jpg" → "http://host/uploads/xyz.jpg") */
const toAbsoluteMediaUrl = (req, fileUrl) => {
  if (!fileUrl) return null;
  // already absolute?
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;
  // normalize leading slash
  const cleaned = fileUrl.replace(/^\/?/, "");
  return `${getBaseUrl(req)}/${cleaned}`;
};

// Middleware for verifying either user or authority token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: false, message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    // Try user token
    req.user = jwt.verify(token, USER_SECRET);
    req.role = "user";
    return next();
  } catch {
    try {
      // Try authority token
      req.user = jwt.verify(token, AUTHORITY_SECRET);
      req.role = "authority";
      return next();
    } catch {
      return res.status(403).json({ status: false, message: "Invalid or expired token" });
    }
  }
};

/**
 * NOTE: If your users table is actually named `users` (not `userAuth`),
 * switch the JOIN line accordingly:
 *   JOIN users u ON r.citizenId = u.id
 */

// =============================
// Fetch citizen's reports
// =============================
router.get("/auth-reporting", verifyToken, (req, res) => {
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
      JOIN userAuth u ON r.citizenId = u.id   -- <-- change to 'users' if that's your table
      LEFT JOIN report_media m ON r.id = m.reportId
      WHERE r.citizenId = ?
      ORDER BY r.date DESC, m.id ASC          -- <-- avoids unknown column 'uploadedAt'
    `;

    connection.query(reportsQuery, [citizenId], (err, rows) => {
      if (err) {
        console.error("DB Fetch Error:", err);
        return res.status(500).json({ status: false, message: "Database error" });
      }

      const map = new Map();
      const reports = [];

      rows.forEach((row) => {
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
          map.set(row.reportId, report);
          reports.push(report);
        }

        if (row.mediaId) {
          map.get(row.reportId).media.push({
            mediaId: row.mediaId,
            type: row.file_type,
            // 🔧 Make URL absolute here
            url: toAbsoluteMediaUrl(req, row.file_url?.startsWith("uploads/")
              ? row.file_url
              : `uploads/${row.file_url}` // in case only filename is stored
            ),
          });
        }
      });

      return res.status(200).json({ status: true, reports, role: req.role });
    });
  } catch (err) {
    console.error("Route Error:", err);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
});

// =============================
// Fetch single report by ID
// =============================
router.get("/report/:reportId", verifyToken, (req, res) => {
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
      JOIN userAuth u ON r.citizenId = u.id   -- <-- change to 'users' if that's your table
      LEFT JOIN report_media m ON r.id = m.reportId
      WHERE r.id = ? AND r.citizenId = ?
      ORDER BY m.id ASC                        -- <-- avoids 'uploadedAt'
    `;

    connection.query(reportQuery, [reportId, citizenId], (err, rows) => {
      if (err) {
        console.error("DB Fetch Error:", err);
        return res.status(500).json({ status: false, message: "Database error" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ status: false, message: "Report not found or unauthorized" });
      }

      const first = rows[0];
      const report = {
        reportId: first.reportId,
        title: first.title,
        description: first.description,
        category: first.category,
        location: first.location,
        latitude: first.latitude,
        longitude: first.longitude,
        date: first.date,
        status: first.status,
        userId: first.userId,
        userName: first.userName,
        media: [],
      };

      rows.forEach((row) => {
        if (row.mediaId) {
          report.media.push({
            mediaId: row.mediaId,
            type: row.file_type,
            url: toAbsoluteMediaUrl(req, row.file_url?.startsWith("uploads/")
              ? row.file_url
              : `uploads/${row.file_url}`
            ),
          });
        }
      });

      return res.status(200).json({ status: true, report, role: req.role });
    });
  } catch (err) {
    console.error("Route Error:", err);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
});

export default router;
