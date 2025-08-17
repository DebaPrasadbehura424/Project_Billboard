import express from "express";
import {
  createCitizen,
  getCitizenById,
  loginCitizen,
} from "../model/citizenModel.js";

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

router.get("/:id", async (req, res) => {
  try {
    const citizen = await getCitizenById(req.params.id);
    if (!citizen) return res.status(404).json({ message: "Not found" });
    res.json(citizen);
  } catch (err) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
