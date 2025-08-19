import { pool } from "../database/db.js";

export const initializeAuthorityDatabase = async () => {
  try {
    await pool.execute(`
    CREATE TABLE IF NOT EXISTS authoritys(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    phoneNumber VARCHAR(20),
    role VARCHAR(20),
    password VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   )
    `);
  } catch (error) {
    console.error("❌ Error creating citizens table:", error.message);
  }
};
