import express from "express";
import {
  RegisterCitizen,
  LoginCitizen,
  getAllCitizens,
  getCitizenAndById,
} from "../controller/citizenController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", RegisterCitizen);
router.post("/login", LoginCitizen);
router.get("/getall", getAllCitizens);
router.get("/getbyId", verifyToken, getCitizenAndById);

export default router;
