import jwt from "jsonwebtoken";
const JWT_KEY = process.env.SECRET_KEY || "testSecretKey";
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_KEY, { expiresIn: "1d" });
};
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_KEY);
    console.log(decoded);

    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
