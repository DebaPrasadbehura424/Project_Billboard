import express from "express";
import {
  createReport,
  getAllReports,
  getReportById,
  getByCitizen,
  updateStatus,
} from "../controller/reportController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/uploadImage.js";

const router = express.Router();

router.post("/create", verifyToken, upload.single("photo"), createReport);

router.get("/get_all", getAllReports);

router.get("/get_one/:reportId", getReportById);
router.get("/get_by_citizen/:citizenId", getByCitizen);
router.patch("/update_status", updateStatus);

export default router;
