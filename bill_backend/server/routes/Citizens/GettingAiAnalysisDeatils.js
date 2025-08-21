import express from "express";
import jwt from "jsonwebtoken";
import connection from "../../database/TestDb.js";

const router = express.Router();


const secKey = "billboard@2025";
const secKeyAuthority = "authorityBillboard@2025";

// middleware to verify JWT (works for both user + authority)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            status: false,
            message: "Invalid auth header. Token required.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Try with user secret
        req.user = jwt.verify(token, secKey);
        req.role = "user";
        return next();
    } catch (errUser) {
        try {
            // Try with authority secret
            req.user = jwt.verify(token, secKeyAuthority);
            req.role = "authority";
            return next();
        } catch (errAuth) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized: Invalid or expired token",
            });
        }
    }
};

// ================== ROUTE ==================
router.get("/ai-analysis/:reportId", verifyToken, async (req, res) => {
    try {
        const { reportId } = req.params;

        // Query latest analysis for the report
        const query = `
            SELECT 
                reportId,
                risk_percentage,
                risk_level,
                risk_description,
                category,
                extracted_text,
                createdAt
            FROM ai_analysis 
            WHERE reportId = ?
            ORDER BY createdAt DESC
            LIMIT 1
        `;

        const analysisData = await new Promise((resolve, reject) => {
            connection.query(query, [reportId], (err, results) => {
                if (err) {
                    console.error("Database query error:", err);
                    reject(new Error("Failed to fetch AI analysis data"));
                } else if (results.length === 0) {
                    resolve(null);
                } else {
                    resolve(results[0]);
                }
            });
        });

        // If no analysis exists yet
        if (!analysisData) {
            return res.status(200).json({
                status: true,
                message: "No AI analysis available yet for this report",
                data: {}
            });
        }

        // Create AI summary
        const summary = `Risk Level: ${analysisData.risk_level} (${analysisData.risk_percentage}%) - ${analysisData.risk_description}`;

        const responseData = {
            reportId: analysisData.reportId,
            riskAssessment: {
                percentage: analysisData.risk_percentage,
                level: analysisData.risk_level,
                category: analysisData.category
            },
            risks: analysisData.risk_description,
            extractedContent: analysisData.extracted_text,
            aiSummary: summary,
            analyzedAt: analysisData.createdAt,
            role: req.role   // ✅ tells if request came from "user" or "authority"
        };

        return res.status(200).json({
            status: true,
            message: "AI analysis data retrieved successfully",
            data: responseData
        });

    } catch (err) {
        console.error("Get AI Analysis Error:", err);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
});

export default router;
