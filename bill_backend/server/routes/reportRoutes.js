import express from "express";
import {
  createReport,
  getAllReports,
  getReportById,
  getByCitizen,
} from "../controller/reportController.js";

const router = express.Router();

router.post("/create", createReport);

router.get("/get_all", getAllReports);

router.get("/get_one/:reportId", getReportById);
router.get("/get_by_citizen/:citizenId", getByCitizen);

export default router;
