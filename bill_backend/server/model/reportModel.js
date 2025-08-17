import { pool } from "../database/db.js";

export const initializeReportDatabase = async () => {
  try {
    await pool.execute(`
  CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  citizenId INT,
  title VARCHAR(255),
  category VARCHAR(100),
  location VARCHAR(255),
  description varchar(255),
  date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (citizenId) REFERENCES citizens(id) ON DELETE CASCADE
)
`);
    await pool.execute(`
CREATE TABLE IF NOT EXISTS report_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reportId INT,
  photoPath VARCHAR(255),
  FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE
)
`);
  } catch (error) {
    console.error("❌ Error creating citizens table:", error.message);
  }
};
