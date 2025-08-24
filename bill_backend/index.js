import cors from "cors";
import express from "express";
import path from "path";

import connection from "./server/database/TestDb.js";
import { AuthorityTable, AuthTable } from "./server/model/AuthModel.js";
import CitizenReport from "./server/model/citizenReports.js";

import ChangeStatus from "./server/routes/Authority/ApproveRejectReports.js";
import {
  default as AuthorityAuthentication,
  default as AuthorityLogin,
} from "./server/routes/Authority/AuthorityAthentication.js";
import CitizenReportsFromAuthDash from "./server/routes/Authority/CitizenReportsByIdFromDash.js";
import CitizenStatus from "./server/routes/Authority/CitizenStatus.js";
import GetAllUserForAuthority from "./server/routes/Authority/GerAlluserForAuthority.js";
import GetAuthorityInfo from "./server/routes/Authority/GettingAuthorityNameEmail.js";
import PendingReports from "./server/routes/Authority/ShowingonlyPendingReports.js";

import AuthRoutes from "./server/routes/Citizens/AuthRoutes.js";
import citizenReportsRoutes from "./server/routes/Citizens/citizenReportRoute.js";
import {
  default as getAuthReporting,
  default as ReportId,
} from "./server/routes/Citizens/getAuthReporting.js";
import GetAuthInfo from "./server/routes/Citizens/GetAuthRoute.js";
import GetAiAnalysisForId from "./server/routes/Citizens/GettingAiAnalysisDeatils.js";

import HeatMapViolation from "./server/routes/heatmap/violation.js";

//our database connected if table not created automated created
connection;

//create tables
AuthTable();
AuthorityTable();
CitizenReport();

const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

//our routes and works here

//user login and register here
app.use("/api/auth", AuthRoutes);

//token verify  and extractdeatils
app.use("/api", GetAuthInfo);

// get  CitizenReport deatils
app.use("/api", citizenReportsRoutes);

//auth dashbaord and citizen report details
app.use("/api", getAuthReporting);

//for testing we build this route not necessary
app.use("/api", ReportId);

//get all citizens and there deatils  for security we use diffrent route
app.use("/api/authority", GetAllUserForAuthority);

//extract citizen status
app.use("/api/status", CitizenStatus);

//can get single report deatils or all citizen report deatils  from auth side
app.use("/api", CitizenReportsFromAuthDash);

//extarcting citizens pending deatils
app.use("/api", PendingReports);

//authorty login and register
app.use("/api", AuthorityAuthentication);

//for testing we build this route not necessary
app.use("/api", AuthorityLogin);

//authority info
app.use("/api", GetAuthorityInfo);

// we get aianalysis details
app.use("/api", GetAiAnalysisForId);

// chnage status
app.use("/api", ChangeStatus);

//heat violation details extract
app.use("/api", HeatMapViolation);

//testing route
app.get("/", (_req, res) => {
  res.status(200).send("Home page of the backend...");
});

//server starting
app.listen(2000, () => {
  console.log("✅ Backend running on http://localhost:2000");
});
