import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import citizenRoutes from "./server/routes/citizenRoutes.js";
import authRoutes from "./server/routes/authorityRoutes.js";
import reportRoutes from "./server/routes/reportRoutes.js";

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

//citizen
app.use("/citizen", citizenRoutes);
app.use("/authority", authRoutes);
app.use("/report", reportRoutes);

app.get("/", (req, res) => {
  res.send("Backend running...");
});

app.listen(PORT, () => {
  console.log(`✅ server started at http://localhost:${PORT}`);
});
