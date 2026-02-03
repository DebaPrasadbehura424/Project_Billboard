import express from "express";
import {
  RegisterCitizen,
  LoginCitizen,
  getAllCitizens,
  getCitizenById,
} from "../controller/citizenController.js";

const router = express.Router();

router.post("/register", RegisterCitizen);
router.post("/login", LoginCitizen);
router.get("/getall", getAllCitizens);
router.get("/getbyId/:id", getCitizenById);

export default router;
