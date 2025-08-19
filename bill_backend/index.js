import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import citizenRoutes from "./server/routes/citizenRoutes.js";
import reportRoutes from "./server/routes/reportRoutes.js";
import authRoutes from "./server/routes/authorityRoutes.js";
import aiRoutes from "./server/routes/aiAnalysisRoutes.js";

import path from "path";
import { intilizeDatabase } from "./server/middleware/IntilizeDatabase.js";
const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//all database
await intilizeDatabase();

//citizen
app.use("/citizen", citizenRoutes);
app.use("/authority", authRoutes);
app.use("/report", reportRoutes);
app.use("/ai", aiRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Backend running...");
});

app.listen(PORT, () => {
  console.log(`✅ server started at http://localhost:${PORT}`);
});
