import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import citizenRoutes from "./server/routes/citizenRoutes.js";
import reportRoutes from "./server/routes/reportRoutes.js";

import { intilizeDatabase } from "./server/middleware/IntilizeDatabase.js";
const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//all database
await intilizeDatabase();

//citizen
app.use("/citizen", citizenRoutes);
app.use("/report", reportRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Backend running...");
});

app.listen(PORT, () => {
  console.log(`✅ server started at http://localhost:${PORT}`);
});
