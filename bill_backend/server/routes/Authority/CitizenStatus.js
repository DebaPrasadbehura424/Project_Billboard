import express from "express";
import connection from "../../database/TestDb.js";

const router = express.Router();

router.get("/citizen-status", async (_req, res) => {
  try {
    const query = `SELECT status FROM reports`;
    connection.query(query, (err, result) => {
      if (err) {
        return res.status(404).json({
          status: false,
          message: "Status not found...",
        });
      }

      if (result && result.length > 0) {
        const statuses = result.map((row) => row.status);
        return res.status(200).json({
          status: true,
          data: statuses,
        });
      } else {
        return res.status(200).json({
          status: true,
          data: [],
          message: "No statuses found.",
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Internal server error...",
    });
  }
});

export default router;
