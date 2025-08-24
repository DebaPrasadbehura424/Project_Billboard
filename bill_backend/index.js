import cors from "cors";
import express from "express";
import path from "path";

import connection from "./server/database/TestDb.js";
import { AuthorityTable, AuthTable } from "./server/model/AuthModel.js";
import CitizenReport from "./server/model/citizenReports.js";

import ChangeStatus from "./server/routes/Authority/ApproveRejectReports.js";
import { default as AuthorityAuthentication, default as AuthorityLogin } from "./server/routes/Authority/AuthorityAthentication.js";
import CitizenReportsFromAuthDash from "./server/routes/Authority/CitizenReportsByIdFromDash.js";
import CitizenStatus from "./server/routes/Authority/CitizenStatus.js";
import GetAllUserForAuthority from "./server/routes/Authority/GerAlluserForAuthority.js";
import GetAuthorityInfo from "./server/routes/Authority/GettingAuthorityNameEmail.js";
import PendingReports from "./server/routes/Authority/ShowingonlyPendingReports.js";

import AuthRoutes from "./server/routes/Citizens/AuthRoutes.js";
import citizenReportsRoutes from "./server/routes/Citizens/citizenReportRoute.js";
import { default as getAuthReporting, default as ReportId } from "./server/routes/Citizens/getAuthReporting.js";
import GetAuthInfo from "./server/routes/Citizens/GetAuthRoute.js";
import GetAiAnalysisForId from "./server/routes/Citizens/GettingAiAnalysisDeatils.js";




import HeatMapViolation from "./server/routes/heatmap/violation.js";

// ✅ Fix __dirname in ES modules

// Database connection
connection;

// Create required tables
AuthTable();
AuthorityTable();
CitizenReport();

const app = express();

// ✅ Serve uploaded files as static
// now http://localhost:2000/uploads/filename.jpg will work
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ CORS configuration
app.use(cors({
  origin: "http://localhost:5173",  // your frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

// ✅ JSON parser
app.use(express.json({ limit: "10mb" }));

// ----------------- Routes -----------------
app.use("/api/auth", AuthRoutes);
app.use("/api", GetAuthInfo);
app.use("/api", citizenReportsRoutes);
app.use("/api", getAuthReporting);
app.use("/api", ReportId);
app.use("/api/authority", GetAllUserForAuthority);
app.use("/api/status", CitizenStatus);
app.use("/api", CitizenReportsFromAuthDash);
app.use("/api", PendingReports);
app.use("/api", AuthorityAuthentication);
app.use("/api", AuthorityLogin);
app.use("/api", GetAuthorityInfo);
app.use("/api", GetAiAnalysisForId);
app.use("/api", ChangeStatus);
app.use("/api",HeatMapViolation);

// Default route
app.get("/", (_req, res) => {
  res.status(200).send("Home page of the backend...");
});

// Start server
app.listen(2000, () => {
  console.log("✅ Backend running on http://localhost:2000");
});
