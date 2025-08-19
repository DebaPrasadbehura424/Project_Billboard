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
      status = "pending", // Default to 'pending' if not provided
      latitude,
      longitude,
    } = report;

    // Validate required fields
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
      ].some((v) => v === undefined || v === null)
    ) {
      throw new Error("One or more bind parameters are undefined");
    }

    // Insert into database
    const [result] = await pool.execute(
      `INSERT INTO reports (
        citizenId, title, category, location, description,
        date, status, latitude, longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ]
    );

    return result.insertId;
  },
};
