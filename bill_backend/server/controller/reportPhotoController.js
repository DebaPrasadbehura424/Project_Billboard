import { reportModel } from "./reportController.js";
import { photoModel } from "./photoController.js";
import { pool } from "../database/db.js";

export const createReportWithPhotos = async (req, res) => {
  try {
    const {
      citizenId,
      title,
      category,
      location,
      description,
      date,
      latitude,
      longitude,
      status,
      risk_percentage,
      risk_level,
      risk_reason,
    } = req.body;

    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one photo is required." });
    }

    if (
      !citizenId ||
      !title ||
      !category ||
      !location ||
      !date ||
      !latitude ||
      !longitude ||
      !status
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const citizenIdNum = Number(citizenId);
    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);

    if (isNaN(citizenIdNum) || isNaN(latNum) || isNaN(lngNum)) {
      return res
        .status(400)
        .json({ message: "Invalid citizenId or coordinates." });
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
      latitude: latNum,
      longitude: lngNum,
      status: status || "pending",
      risk_percentage: parseInt(risk_percentage) || 0,
      risk_level: risk_level || "Unknown",
      risk_reason: risk_reason || "Not provided",
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
      SELECT 
        r.id,
        r.title,
        r.category,
        r.location,
        r.latitude,
        r.longitude,
        r.description,
        r.date,
        r.risk_percentage,
        r.risk_level,
        r.risk_reason,
        r.status,
        r.createdAt,
        r.citizenId,
        c.name AS citizenName
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


export const getCitizenReportsById = async (citizenId) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT 
        r.id AS reportId,
        r.title,
        r.category,
        r.location,
        r.description,
        r.date,
        r.latitude,
        r.longitude,
        r.status,
        r.createdAt,
        p.id AS photoId,
        p.photoPath
      FROM reports r
      LEFT JOIN report_photos p ON r.id = p.reportId
      WHERE r.citizenId = ?
      ORDER BY r.createdAt DESC
    `,
      [citizenId]
    );

    const reportMap = {};

    for (const row of rows) {
      const reportId = row.reportId;

      if (!reportMap[reportId]) {
        reportMap[reportId] = {
          id: reportId,
          title: row.title,
          category: row.category,
          location: row.location,
          description: row.description,
          date: row.date,
          latitude: row.latitude,
          longitude: row.longitude,
          status: row.status,
          createdAt: row.createdAt,
          photos: [],
        };
      }

      if (row.photoId) {
        reportMap[reportId].photos.push({
          id: row.photoId,
          path: row.photoPath,
        });
      }
    }

    return Object.values(reportMap);
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};
export const getReportsById = async (reportId) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT 
        r.id AS reportId,
        r.title,
        r.category,
        r.location,
        r.description,
        r.date,
        r.latitude,
        r.longitude,
        r.status,
        r.createdAt,
        r.risk_percentage,
        r.risk_level,
        r.risk_reason,
        p.id AS photoId,
        p.photoPath
      FROM reports r
      LEFT JOIN report_photos p ON r.id = p.reportId
      WHERE r.id = ?
      `,
      [reportId]
    );

    if (rows.length === 0) {
      return null;
    }

    const report = {
      id: rows[0].reportId,
      title: rows[0].title,
      category: rows[0].category,
      location: rows[0].location,
      description: rows[0].description,
      date: rows[0].date,
      latitude: rows[0].latitude,
      longitude: rows[0].longitude,
      status: rows[0].status,
      createdAt: rows[0].createdAt,

      // ✅ Added AI risk fields
      risk_percentage: rows[0].risk_percentage,
      risk_level: rows[0].risk_level,
      risk_reason: rows[0].risk_reason,

      photos: [],
    };

    for (const row of rows) {
      if (row.photoId) {
        report.photos.push({
          id: row.photoId,
          path: row.photoPath,
        });
      }
    }

    return report;
  } catch (error) {
    console.error("Error fetching report by ID:", error);
    throw error;
  }
};

export const getReportAll = async () => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT 
        r.id AS reportId,
        r.title,
        r.category,
        r.location,
        r.description,
        r.date,
        r.latitude,
        r.longitude,
        r.status,
        r.createdAt,
        r.risk_percentage,
        r.risk_level,
        r.risk_reason,
        p.id AS photoId,
        p.photoPath
      FROM reports r
      LEFT JOIN report_photos p ON r.id = p.reportId
    `
    );

    if (rows.length === 0) {
      return [];
    }

    const reportsMap = new Map();

    for (const row of rows) {
      const reportId = row.reportId;

      if (!reportsMap.has(reportId)) {
        reportsMap.set(reportId, {
          id: reportId,
          title: row.title,
          category: row.category,
          location: row.location,
          description: row.description,
          date: row.date,
          latitude: row.latitude,
          longitude: row.longitude,
          status: row.status,
          createdAt: row.createdAt,

          // ✅ Added AI analysis fields
          risk_percentage: row.risk_percentage,
          risk_level: row.risk_level,
          risk_reason: row.risk_reason,

          photos: [],
        });
      }

      if (row.photoId) {
        reportsMap.get(reportId).photos.push({
          id: row.photoId,
          path: row.photoPath,
        });
      }
    }

    return Array.from(reportsMap.values());
  } catch (error) {
    console.error("Error fetching all reports:", error);
    throw error;
  }
};
