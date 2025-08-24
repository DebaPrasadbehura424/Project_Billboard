import express from "express";
import connection from "../../database/TestDb.js";

const router = express.Router();

router.get("/violations", (_req, res) => {
  connection.query("SELECT * FROM reports", (err, results) => {
    if (err) {
      console.error("Error fetching violations:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});

export default router;
