import express from "express";
import {
  createReportWithPhotos,
  getUnapprovedReports,
} from "../controller/reportPhotoController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/send_report", upload.array("photo", 5), createReportWithPhotos);
router.get("/unapproved_reports", getUnapprovedReports);

export default router;
