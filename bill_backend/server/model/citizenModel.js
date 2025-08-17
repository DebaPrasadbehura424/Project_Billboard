import { pool } from "../database/db.js";

export const initializeCitizenDatabase = async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS citizens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phoneNumber VARCHAR(20),
        role VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.error("❌ Error creating citizens table:", error.message);
  }
};
