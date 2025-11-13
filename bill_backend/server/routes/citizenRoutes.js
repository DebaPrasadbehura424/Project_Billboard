import express from "express";
import {
  createCitizen,
  getCitizenById,
  loginCitizen,
  getCitizeAll,
} from "../controller/citizenController.js";
import { verifyToken } from "../jsonwentoken/jwt.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import cloudinary from "../middleware/cloudnary.js";
import multer from "multer";
import { pool } from "../database/db.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
router.post("/getById", async (req, res) => {
  const { citizenId } = req.body;

  try {
    const getCitizen = await getCitizenById(citizenId);
    res.status(200).json(getCitizen);
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

router.patch("/updateprofile", upload.single("profile"), async (req, res) => {
  try {
    const { citizenId, name, email, phoneNumber } = req.body;

    if (!citizenId) {
      return res.status(400).json({ error: "citizenId is required" });
    }

    let photoUrl;

    if (req.file) {
      photoUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "citizen_profiles" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(req.file.buffer);
      });
    }

    let query = `
      UPDATE citizens 
      SET name = ?, email = ?, phoneNumber = ? ${photoUrl ? ", photo = ?" : ""}
      WHERE id = ?
    `;
    let params = photoUrl
      ? [name, email, phoneNumber, photoUrl, citizenId]
      : [name, email, phoneNumber, citizenId];

    await pool.execute(query, params);

    const [rows] = await pool.execute("SELECT * FROM citizens WHERE id = ?", [
      citizenId,
    ]);

    res.json(rows[0]);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: "Failed to update profile" });
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
