import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "../component/Footer";
import NavBar from "../component/Navbar";
import About from "../pages/About";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import CitizenDashboard from "../pages/DashBoard/CitizenDashboard";
import Home from "../pages/Home";
import HeatMapPage from "../pages/HeatMap/HeatMapPage";
import ReportDetails from "../pages/Report/ReportDetails";
import AuthorityDashboard from "../pages/DashBoard/AuthorityDashboard";
import CitizenViolation from "../pages/violation/citizenViolation";
import NewViolation from "../pages/violation/newViolation";
import ShowReports from "../pages/Report/ShowReports";
import CitizenReports from "../component/authComponent/CitizenReports";

function Navigation() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* intializes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* dashboard */}
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
        {/* heatmap */}
        <Route path="/heatmap" element={<HeatMapPage />} />
        {/* report */}
        <Route path="/report-deatils/:id" element={<ReportDetails />} />
        <Route path="/show-report/:citizenReportId" element={<ShowReports />} />

        {/* violation */}
        <Route path="/citizen_violation" element={<CitizenViolation />} />
        <Route path="/new_violation" element={<NewViolation />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default Navigation;
