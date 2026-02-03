import express from "express";
import {
  RegisterAuthority,
  LoginAuthority,
} from "../controller/authorityController.js";

const router = express.Router();

router.post("/register", RegisterAuthority);

router.post("/login", LoginAuthority);

export default router;
