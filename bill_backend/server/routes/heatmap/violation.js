// routes/violations.js
import express from "express";
import connection from "../../database/TestDb.js"; // your MySQL connection (with .query)

const router = express.Router();

// ✅ GET all violations (with safe defaults)
router.get("/violations", async (_req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM reports");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching violations:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

export default router;
