import express from "express";
import path from "path";

import cors from "cors";
import connection from "./server/database/TestDb.js";
import { AuthorityTable, AuthTable } from "./server/model/AuthModel.js";
import CitizenReport from "./server/model/citizenReports.js";
import { default as AuthorityAuthentication, default as AuthorityLogin } from "./server/routes/Authority/AuthorityAthentication.js";
import CitizenReportsFromAuthDash from "./server/routes/Authority/CitizenReportsByIdFromDash.js";
import CitizenStatus from "./server/routes/Authority/CitizenStatus.js";
import GetAllUserForAuthority from "./server/routes/Authority/GerAlluserForAuthority.js";
import GetAuthorityInfo from "./server/routes/Authority/GettingAuthorityNameEmail.js";
import PendingReports from "./server/routes/Authority/ShowingonlyPendingReports.js";
import Aianalyze from "./server/routes/Citizens/AiAnalyze.js";
import AuthRoutes from "./server/routes/Citizens/AuthRoutes.js";
import citizenReportsRoutes from "./server/routes/Citizens/citizenReportRoute.js";
import { default as getAuthReporting, default as ReportId } from "./server/routes/Citizens/getAuthReporting.js";
import GetAuthInfo from "./server/routes/Citizens/GetAuthRoute.js";

// Database connection
connection;

//tables
AuthTable();
AuthorityTable();
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
app.use("/api",CitizenReportsFromAuthDash);
app.use("/api",PendingReports);
app.use("/api",AuthorityAuthentication);
app.use("/api",AuthorityLogin);
app.use("/api",GetAuthorityInfo);
app.use("/api",Aianalyze);




app.get("/", (_req, res) => {
  res.status(200).send("Home page of the backend...");
});

// Start server
app.listen(2000, () => {
  console.log("Backend connected on port 2000...");
});
