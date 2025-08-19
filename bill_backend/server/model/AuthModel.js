import connection from "../database/TestDb.js";

export const AuthTable = () => {
  const myquery = `
    CREATE TABLE IF NOT EXISTS userAuth (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(200) NOT NULL UNIQUE,
      number VARCHAR(15) NOT NULL UNIQUE,
      password VARCHAR(200) NOT NULL,
      user_type ENUM('citizen','authority') NOT NULL DEFAULT 'citizen'
    )
  `;
  connection.query(myquery, (err) => {
    if (err) {
      console.error("❌ Error in userAuth table creation:", err.message);
    } else {
      console.log("✅ userAuth table created (or already exists).");
    }
  });
};

export const AuthorityTable = () => {
  const myquery = `
    CREATE TABLE IF NOT EXISTS authorityAuth (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(200) NOT NULL UNIQUE,
      number VARCHAR(15) NOT NULL UNIQUE,
      password VARCHAR(200) NOT NULL
    )
  `;
  connection.query(myquery, (err) => {
    if (err) {
      console.error("❌ Error in authorityAuth table creation:", err.message);
    } else {
      console.log("✅ authorityAuth table created (or already exists).");
    }
  });
};
