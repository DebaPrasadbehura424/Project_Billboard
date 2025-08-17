import connection from "../database/TestDb.js";

const CitizenReport = () => {
  // Reports table
  const reportTableQuery = `
    CREATE TABLE IF NOT EXISTS reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      citizenId INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      location VARCHAR(255) NOT NULL,
      description VARCHAR(500) NOT NULL,
      date DATE NOT NULL,
      latitude DECIMAL(9,6),
      longitude DECIMAL(9,6),
      status VARCHAR(50) DEFAULT 'pending',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (citizenId) REFERENCES userAuth(id) ON DELETE CASCADE
    );
  `;

  // Media table
  const mediaTableQuery = `
    CREATE TABLE IF NOT EXISTS report_media (
      id INT AUTO_INCREMENT PRIMARY KEY,
      reportId INT NOT NULL,
      file_url VARCHAR(500) NOT NULL,
      file_type ENUM('image','video') NOT NULL,
      uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE
    );
  `;

  // Create reports table
  connection.query(reportTableQuery, (err) => {
    if (err) {
      console.log("❌ Error creating reports table:", err);
    } else {
      console.log("✅ Reports table ready...");
      connection.query(mediaTableQuery, (err2) => {
        if (err2) {
          console.log("❌ Error creating report_media table:", err2);
        } else {
          console.log("✅ Report_media table ready...");
        }
      });
    }
  });
};

export default CitizenReport;
