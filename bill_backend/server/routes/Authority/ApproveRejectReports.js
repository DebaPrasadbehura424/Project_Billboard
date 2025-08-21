import express from "express";
import connection from "../../database/TestDb.js";

const router = express.Router();

router.put("/change-status/:id", async (req, res) => {
  try {
    const reportId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ 
        status: false,
        message: "Status is required" 
      });
    }

    const query = `UPDATE reports SET status = ? WHERE id = ?`;

    connection.query(query, [status, reportId], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          status: false,
          message: "Database error while updating report status",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: "Report not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Report status updated successfully",
        data: { id: reportId, status },
      });
    });
  } catch (err) {
    console.error("Internal error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

export default router;
