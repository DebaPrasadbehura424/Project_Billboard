import express from "express";
import { createReportWithPhotos } from "../controller/reportController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/send_report", upload.array("photo", 5), createReportWithPhotos);

export default router;
