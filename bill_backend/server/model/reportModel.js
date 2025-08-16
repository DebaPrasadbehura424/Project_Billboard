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
    } = report;

    console.log("Received in model.create:", {
      citizenId,
      title,
      category,
      location,
      description,
      date,
      status,
    });

    if (
      [citizenId, title, category, location, description, date, status].some(
        (v) => v === undefined
      )
    ) {
      throw new Error("One or more bind parameters are undefined");
    }

    const [result] = await pool.execute(
      `INSERT INTO reports (citizenId, title, category, location, description, date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [citizenId, title, category, location, description, date, status]
    );

    return result.insertId;
  },
};
