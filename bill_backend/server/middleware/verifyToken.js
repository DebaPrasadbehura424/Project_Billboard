import jwt from "jsonwebtoken";
const JWT_KEY = process.env.SECRET_KEY || "testSecretKey";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
