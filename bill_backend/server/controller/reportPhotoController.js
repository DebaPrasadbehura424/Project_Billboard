import { reportModel } from "./reportController.js";
import { photoModel } from "./photoController.js";
import { pool } from "../database/db.js";
export const createReportWithPhotos = async (req, res) => {
  try {
    const { citizenId, title, category, location, description, date } =
      req.body;

    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one photo is required." });
    }

    if (!citizenId || !title || !category || !location || !date) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const citizenIdNum = Number(citizenId);
    if (isNaN(citizenIdNum)) {
      return res
        .status(400)
        .json({ message: "citizenId must be a valid number." });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Expected YYYY-MM-DD." });
    }

    const reportId = await reportModel.create({
      citizenId: citizenIdNum,
      title,
      category,
      description,
      location,
      date,
    });

    await photoModel.addMultiple(reportId, files);

    res.status(201).json({ message: "Report created successfully", reportId });
  } catch (err) {
    console.error("Error in createReportWithPhotos:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getUnapprovedReports = async (req, res) => {
  try {
    const [reports] = await pool.execute(`
      SELECT r.id, r.title, r.status, r.description, r.date, r.citizenId, c.name AS citizenName
      FROM reports r
      JOIN citizens c ON r.citizenId = c.id
      WHERE r.status != 'approved'
      ORDER BY r.createdAt DESC
    `);

    if (reports.length === 0) return res.json([]);

    const reportIds = reports.map((r) => r.id);
    const [photos] = await pool.query(
      `SELECT reportId, photoPath FROM report_photos WHERE reportId IN (${reportIds
        .map(() => "?")
        .join(",")})`,
      reportIds
    );

    const combined = reports.map((r) => ({
      ...r,
      photos: photos.filter((p) => p.reportId === r.id),
    }));

    res.json(combined);
  } catch (e) {
    console.error("Error fetching reports:", e.message);
    res.status(500).json({ error: e.message });
  }
};
