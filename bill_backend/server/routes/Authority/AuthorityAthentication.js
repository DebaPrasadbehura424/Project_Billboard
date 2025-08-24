import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import connection from "../../database/TestDb.js";

const router = express.Router();

const secKey = "authorityBillboard@2025";

// authority Register
router.post("/authority-register", async (req, res) => {
    try {
        const { name, email, number, password } = req.body;

        if (!name || !email || !number || !password) {
            return res.status(400).json({
                status: false,
                message: "All fields are required...",
            });
        }

        const hashpass = await bcrypt.hash(password, 10);

        const query = `
      INSERT INTO authorityAuth (name, email, number, password) 
      VALUES (?, ?, ?, ?)
    `;

        connection.query(query, [name, email, number, hashpass], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        status: false,
                        message: "Email or number already exists...",
                    });
                }
                console.error("DB Error:", err.message);
                return res.status(500).json({
                    status: false,
                    message: "Database error...",
                });
            }

            return res.status(201).json({
                status: true,
                message: "Authority registered successfully!",
                data: { id: result.insertId, name, email, number },
            });
        });
    } catch (err) {
        console.error("Server Error:", err.message);
        return res.status(500).json({
            status: false,
            message: "Internal server error...",
        });
    }
});

// authority Login
router.post("/authority-login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "Please fill in all required fields",
            });
        }

        const query = `SELECT * FROM authorityAuth WHERE email = ?`;

        connection.query(query, [email], async (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Database error",
                    error: err.message,
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: "User not found",
                });
            }

            const user = result[0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    status: false,
                    message: "Invalid credentials",
                });
            }

            const token = jwt.sign(
                { id: user.id, name: user.name, email: user.email},
                secKey,
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                status: true,
                message: "Login successful",
                token,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            });
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message,
        });
    }
});

export default router;
