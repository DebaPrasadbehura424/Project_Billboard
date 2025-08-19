import { pool } from "../database/db.js";

export const photoModel = {
  addMultiple: async (reportId, files) => {
    const values = files.map((file) => {
      let relativePath = file.path.split("uploads")[1];

      relativePath = relativePath.replace(/\\/g, "/");

      // here  will use another optimize appoarch ok
      if (relativePath.startsWith("/")) {
        relativePath = relativePath.substring(1);
      }

      relativePath = `uploads/${relativePath}`;

      return [reportId, relativePath];
    });

    await pool.query(
      `INSERT INTO report_photos (reportId, photoPath) VALUES ?`,
      [values]
    );
  },
};
