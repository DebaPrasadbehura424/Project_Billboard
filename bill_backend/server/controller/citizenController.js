import { pool } from "../database/db.js";
import { generateToken, verifyToken } from "../jsonwentoken/jwt.js";

export const createCitizen = {
  create: async (citizen) => {
    const { name, email, phoneNumber, role, password } = citizen;

    const [result] = await pool.execute(
      `INSERT INTO citizens (name, email, phoneNumber, role, password)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phoneNumber, role, password]
    );

    const newCitizenId = result.insertId;

    const payload = {
      id: newCitizenId,
      email,
      role,
    };

    const token = generateToken(payload);

    return { token };
  },
};

export const getCitizenById = async (id) => {
  const [rows] = await pool.execute(`SELECT * FROM citizens WHERE id = ?`, [
    id,
  ]);
  return rows[0];
};
export const getCitizeAll = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id,name, email, phoneNumber FROM citizens"
    );
    return rows;
  } catch (error) {
    console.error("❌ Failed to fetch citizens:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const loginCitizen = async (email, password) => {
  const [rows] = await pool.execute(
    `SELECT * FROM citizens WHERE email = ? LIMIT 1`,
    [email]
  );

  const user = rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  // Compare password (in production, hash + compare using bcrypt)
  if (user.password !== password) {
    throw new Error("Invalid password");
  }

  console.log(user);

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  

  const token = generateToken(payload);

  return {
    token,
  };
};
