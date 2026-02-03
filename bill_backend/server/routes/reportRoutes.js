import express from "express";
import {
  createReport,
  getAllReports,
  getReportById,
} from "../controller/reportController.js";

const router = express.Router();

router.post("/create", createReport);

router.get("/get_all", getAllReports);

router.get("/get_one/:reportId", getReportById);

export default router;
