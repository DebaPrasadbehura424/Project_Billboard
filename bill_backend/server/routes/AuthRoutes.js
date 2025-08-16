import bcrypt from "bcrypt";
import express from "express";
import JWT from "jsonwebtoken";
import connection from "../database/TestDb.js";



const secKey = "billboard@2025";

const router = express.Router();

router.post("/userAuth-register", async (req, res) => {
  try {
    const { name, email, password, number, userType } = req.body;

    if (!name || !email || !password || !number) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const hashpass = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO userAuth (name, email, password, number, user_type) 
      VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
      query,
      [name, email, hashpass, number, userType || "citizen"],
      (err, results) => {
        if (err) {
          console.error("DB error:", err.message);
          return res.status(500).json({
            success: false,
            message: "Database error",
          });
        }

        return res.status(201).json({
          success: true,
          message: "User registered successfully",
          userId: results.insertId,
        });
      }
    );
  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});



router.post("/userAuth-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required...",
      });
    }

    // check user
    const query = `SELECT * FROM userAuth WHERE email = ?`;
    connection.query(query, [email], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error...",
        });
      }

      if (result.length === 0) {
        return res.status(401).json({
          success: false,
          message: "User not found...",
        });
      }

      const user = result[0];

      // compare password
      bcrypt.compare(password, user.password, (err, ismatch) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error while checking password...",
          });
        }

        if (!ismatch) {
          return res.status(401).json({
            success: false,
            message: "Invalid credentials...",
          });
        }

        // generate JWT token
        const token = JWT.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            number: user.number,
            user_type: user.user_type,
          },
          secKey,
          { expiresIn: "1d" }
        );

        return res.status(200).json({
          success: true,
          message: "Login successful...",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            user_type: user.user_type,
          },
        });
      });
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).send("Internal server error...");
  }
});









export default router;
