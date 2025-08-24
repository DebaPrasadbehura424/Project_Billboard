import express from "express";
import connection from "../../database/TestDb.js";

const router = express.Router();

router.get("/pending-reports", async (_req, res) => {
  try {
    const query = `
      SELECT 
        id AS reportId,
        title,
        description,
        category,
        location,
        latitude,
        longitude,
        date,
        status
      FROM reports
      WHERE status = 'pending'
      ORDER BY date DESC
    `;

    connection.query(query, (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({
          status: false,
          message: "Database error while fetching pending reports",
        });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No pending reports found",
        });
      }

      return res.status(200).json({
        status: true,
        data: result,
      });
    });
  } catch (err) {
    console.error("Route Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error...",
    });
  }
});

export default router;


