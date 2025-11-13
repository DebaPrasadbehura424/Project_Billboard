import express from "express";
import {
  createReportWithPhotos,
  getUnapprovedReports,
  getCitizenReportsById,
  getReportsById,
  getReportAll,
  getCommentById,
  addComments,
} from "../controller/reportPhotoController.js";
import { upload } from "../middleware/upload.js";
import { pool } from "../database/db.js";

const router = express.Router();

router.post("/send_report", upload.array("photo", 5), createReportWithPhotos);
router.get("/unapproved_reports", getUnapprovedReports);
router.get("/citizens/:id", async (req, res) => {
  try {
    const citizenId = req.params.id;
    const reports = await getCitizenReportsById(citizenId);
    res.json(reports);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch reports", error: err.message });
  }
});
router.get("/reportDetails/:id", async (req, res) => {
  try {
    const reportId = req.params.id;
    const reports = await getReportsById(reportId);
    res.json(reports);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch reports", error: err.message });
  }
});
router.get("/all", async (req, res) => {
  try {
    const reports = await getReportAll();
    res.status(200).json(reports);
  } catch (err) {
    console.error("Error in GET /all:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

router.patch("/updateStatus/:id/:citizenId", async (req, res) => {
  try {
    const reportId = req.params.id;
    const citizenId = req.params.citizenId;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    await pool.execute(`UPDATE reports SET status = ? WHERE id = ?`, [
      status,
      reportId,
    ]);

    const [rows] = await pool.execute(
      `SELECT points FROM citizens WHERE id = ?`,
      [citizenId]
    );

    const currentPoints = rows[0]?.points ?? 0;
    const updatePoints = currentPoints + 5;

    await pool.execute(`UPDATE citizens SET points = ? WHERE id = ?`, [
      updatePoints,
      citizenId,
    ]);

    res.status(200).json({ message: "Successfully updated" });
  } catch (err) {
    console.error("Error in PATCH /updateStatus:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

router.get("/comments/:id", getCommentById);
router.post("/comments_add", addComments); 

export default router;
