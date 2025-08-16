// CREATE TABLE citizens (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(100),
//   email VARCHAR(100),
//   phoneNumber VARCHAR(20),
//   role VARCHAR(20),
//   password VARCHAR(255),
//   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE reports (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   citizenId INT,
//   title VARCHAR(255),
//   category VARCHAR(100),
//   location VARCHAR(255),
//   date DATE,
//   status VARCHAR(50) DEFAULT 'pending',
//   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (citizenId) REFERENCES citizens(id) ON DELETE CASCADE
// );

// CREATE TABLE report_photos (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   reportId INT,
//   photoPath VARCHAR(255),
//   FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE
// );
