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

  // AI Analysis table
  const aiAnalysisTableQuery = `
  CREATE TABLE IF NOT EXISTS ai_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reportId INT NOT NULL,
    extracted_text TEXT,
    risk_percentage DECIMAL(5,2),
    risk_level VARCHAR(20),
    risk_description TEXT,
    category VARCHAR(100),
    obscene_detected BOOLEAN DEFAULT FALSE,
    political_detected BOOLEAN DEFAULT FALSE,
    content_compliant BOOLEAN DEFAULT TRUE,
    structural_damage BOOLEAN DEFAULT FALSE,
    leaning BOOLEAN DEFAULT FALSE,
    broken_parts BOOLEAN DEFAULT FALSE,
    structural_hazard BOOLEAN DEFAULT FALSE,
    size_appropriate BOOLEAN DEFAULT TRUE,
    obstructs_traffic BOOLEAN DEFAULT FALSE,
    blocks_visibility BOOLEAN DEFAULT FALSE,
    too_close_to_road BOOLEAN DEFAULT FALSE,
    size_details TEXT,
    mismatch_detected BOOLEAN DEFAULT FALSE,
    mismatch_details TEXT,
    analysis_score DECIMAL(5,2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE
    );
  `;

  // Create tables in sequence
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
          connection.query(aiAnalysisTableQuery, (err3) => {
            if (err3) {
              console.log("❌ Error creating ai_analysis table:", err3);
            } else {
              console.log("✅ AI Analysis table ready...");
            }
          });
        }
      });
    }
  });
};

export default CitizenReport;
