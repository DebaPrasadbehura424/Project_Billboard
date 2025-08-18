import express from "express";
import path from "path";


import cors from "cors";
import connection from "./server/database/TestDb.js";
import AuthTable from "./server/model/AuthModel.js";
import CitizenReport from "./server/model/citizenReports.js";
import CitizenStatus from "./server/routes/Authority/CitizenStatus.js";
import GetAllUserForAuthority from "./server/routes/Authority/GerAlluserForAuthority.js";
import AuthRoutes from "./server/routes/Citizens/AuthRoutes.js";
import citizenReportsRoutes from "./server/routes/Citizens/citizenReportRoute.js";
import { default as getAuthReporting, default as ReportId } from "./server/routes/Citizens/getAuthReporting.js";
import GetAuthInfo from "./server/routes/Citizens/GetAuthRoute.js";

// Database connection
connection;


//tables
AuthTable();
CitizenReport();



const app = express();



//acces file 
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));




// CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));



app.use("/api/auth", express.json({ limit: "10mb" }));
app.use("/api", express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api", GetAuthInfo);
app.use("/api", citizenReportsRoutes);
app.use("/api",getAuthReporting);
app.use("/api",ReportId);
app.use("/api/authority",GetAllUserForAuthority);
app.use("/api/status",CitizenStatus);


app.get("/", (_req, res) => {
  res.status(200).send("Home page of the backend...");
});

// Start server
app.listen(2000, () => {
  console.log("Backend connected on port 2000...");
});
