import { pool } from "../database/db.js";

export const photoModel = {
  addMultiple: async (reportId, files) => {
    const values = files.map((file) => [reportId, file.path]);

    await pool.query(
      `INSERT INTO report_photos (reportId, photoPath) VALUES ?`,
      [values]
    );
  },
};
