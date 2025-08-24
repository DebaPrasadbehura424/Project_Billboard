import express from "express";
import connection from "../../database/TestDb.js";

const router = express.Router();

// here we  can get single report deatils or all citizen report deatils 
router.get("/citizen-reports/:citizenId", async (req, res) => {
  const { citizenId, reportId } = req.params;

  try {
    let query;
    let params;

    if (reportId) {
      query = `
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
      params = [reportId, citizenId];
    } else {
      query = `
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
          u.name AS userName
        FROM reports r
        JOIN userAuth u ON r.citizenId = u.id
        WHERE r.citizenId = ?
        ORDER BY r.date DESC
      `;
      params = [citizenId];
    }

    connection.query(query, params, (err, results) => {
      if (err) {
        console.error("DB Fetch Error:", err);
        return res.status(500).json({
          status: false,
          message: "Database error",
        });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No reports found for this citizen",
        });
      }

      if (reportId) {
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

        return res.status(200).json({ status: true, report });
      } else {
        return res.status(200).json({
          status: true,
          reports: results,
        });
      }
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
