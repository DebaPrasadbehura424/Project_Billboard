import { pool } from "../database/db.js";

export const reportModel = {
  create: async (report) => {
    const {
      citizenId,
      title,
      category,
      location,
      description,
      date,
      status = "pending",
      latitude,
      longitude,
      risk_percentage = 0,
      risk_level = "Unknown",
      risk_reason = "Not provided",
    } = report;

    if (
      [
        citizenId,
        title,
        category,
        location,
        description,
        date,
        status,
        latitude,
        longitude,
        risk_percentage,
        risk_level,
        risk_reason,
      ].some((v) => v === undefined || v === null)
    ) {
      throw new Error("One or more bind parameters are undefined");
    }

    const [result] = await pool.execute(
      `INSERT INTO reports (
        citizenId,
        title,
        category,
        location,
        description,
        date,
        status,
        latitude,
        longitude,
        risk_percentage,
        risk_level,
        risk_reason
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        citizenId,
        title,
        category,
        location,
        description,
        date,
        status,
        latitude,
        longitude,
        risk_percentage,
        risk_level,
        risk_reason,
      ]
    );

    return result.insertId;
  },
};
