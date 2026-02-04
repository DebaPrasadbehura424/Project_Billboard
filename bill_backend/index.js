import express from "express";
import cors from "cors";
import { supabase } from "./server/database/db.js";
import dotenv from "dotenv";
import citizenRoutes from "./server/routes/citizenRoutes.js";
import authRoutes from "./server/routes/authorityRoutes.js";
import reportRoutes from "./server/routes/reportRoutes.js";
import { verifyToken } from "./server/middleware/verifyToken.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "https://project-billboard-frontend.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Accept",
    ],
  }),
);
app.use(express.json());

app.use("/citizen", citizenRoutes);
app.use("/authority", authRoutes);
app.use("/report", reportRoutes);

app.post("/me", verifyToken, async (req, res) => {
  const { role } = req.body;
  const userId = req.user.id;

  try {
    let queryTable = role === "authority" ? "authoritys" : "citizens";

    const { data, error } = await supabase
      .from(queryTable)
      .select("full_name, email, phone_number, photo")
      .eq("id", userId)
      .single();

    if (error) return res.status(400).json({ error });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend running...");
});

app.listen(PORT, () => {
  console.log(`✅ server started at http://localhost:${PORT}`);
});
