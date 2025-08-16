import jwt from "jsonwebtoken";
const JWT_KEY = process.env.SECRET_KEY || "testSecretKey";
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_KEY, { expiresIn: "1d" });
};
