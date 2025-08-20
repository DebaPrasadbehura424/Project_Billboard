import express from "express";
import {
  createReportWithPhotos,
  getUnapprovedReports,
  getCitizenReportsById,
  getReportsById,
  getReportAll,
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

router.patch("/updateStatus/:id", async (req, res) => {
  try {
    const reportId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const [result] = await pool.execute(
      `UPDATE reports SET status = ? WHERE id = ?`,
      [status, reportId]
    );
    res.status(200).json("succesfully updated");
  } catch (err) {
    console.error("Error in GET /all:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

export default router;
