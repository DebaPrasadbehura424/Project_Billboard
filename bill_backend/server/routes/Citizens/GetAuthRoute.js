import express from "express";
import JWT from "jsonwebtoken";

const router = express.Router();

const secKey = process.env.SEC_KEY;

// just verify  token and extract the deatils 
router.get("/auth-user", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access...",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = JWT.verify(token, secKey);

    return res.status(200).json({
      success: true,
      message: "Authenticated user fetched successfully...",
      user: decoded,
    });
  } catch (err) {
    console.error("Auth check error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized access...",
    });
  }
});

export default router;
