import { pool } from "../database/db.js";
import { generateToken } from "../jsonwentoken/jwt.js";

export const loginAuthority = async (email, password) => {
  const [rows] = await pool.execute(
    `SELECT * FROM authoritys WHERE email = ? LIMIT 1`,
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
  if (user.role !== "authority") {
    throw new Error("You are not citizen");
  }

  const payload = {
    name: user.name,
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(payload);
  const role = user.role;
  return {
    role,
    token,
  };
};
