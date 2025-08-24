import express from "express";
import connection from "../../database/TestDb.js";

const router = express.Router();

//get all citzen with deatils
router.get("/getalluser-for-authority", async (_req, res) => {
  try {
    const query = `
      SELECT u.id AS userId, u.name, u.email, u.number,
             r.id AS reportId, r.title, r.description, r.category,
             r.location, r.date, r.status
      FROM userauth u
      LEFT JOIN reports r ON u.id = r.citizenId
      ORDER BY u.id, r.date DESC
    `;

    connection.query(query, (err, results) => {
      if (err) {
        console.error("DB Fetch Error:", err);
        return res
          .status(500)
          .json({ status: false, message: "Database error" });
      }

      // Group reports under each user
      const users = [];
      const map = new Map();

      results.forEach((row) => {
        if (!map.has(row.userId)) {
          const user = {
            userId: row.userId,
            name: row.name,
            email: row.email,
            phoneNo: row.number,
            reports: [],
          };
          users.push(user);
          map.set(row.userId, user);
        }

        if (row.reportId) {
          map.get(row.userId).reports.push({
            reportId: row.reportId,
            title: row.title,
            description: row.description,
            category: row.category,
            location: row.location,
            date: row.date,
            status: row.status,
          });
        }
      });

      return res.status(200).json({ status: true, users });
    });
  } catch (err) {
    console.error("Route Error:", err);
    return res.status(500).send("Internal server error...");
  }
});

export default router;
