import express from "express";
import {
  createCitizen,
  getCitizenById,
  loginCitizen,
  getCitizeAll,
} from "../controller/citizenController.js";
import { verifyToken } from "../jsonwentoken/jwt.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const token = await createCitizen.create(req.body);
    res.status(201).json(token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await loginCitizen(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const getAllCitizens = await getCitizeAll();
    res.status(200).json(getAllCitizens);
  } catch (error) {
    console.error("❌ Failed to get all citizens:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/citizenAuth", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access...",
      });
    }
    const jwt = authHeader.split(" ")[1];

    const token = verifyToken(jwt);

    return res.status(200).json({
      success: true,
      message: "Authenticated user fetched successfully...",
      user: decoded,
    });
  } catch (err) {
    console.error("Auth check error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized access...",
    });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await getCitizenById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Error getting user from token:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
