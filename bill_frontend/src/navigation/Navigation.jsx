import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ParticularReports from "../component/AuthorityDashComp/ParticularReports";
import ShowingPendingReports from "../component/AuthorityDashComp/ShowingPendingReports";
import Footer from "../component/Footer";
import NavBar from "../component/Navbar";
import About from "../pages/About";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import AuthorityDashboard from "../pages/DashBoard/AuthorityDashboard";
import CitizenDashboard from "../pages/DashBoard/CitizenDashboard";
import HeatMapPage from "../pages/HeatMap/HeatMapPage";
import Home from "../pages/Home";
import ReportDetails from "../pages/Report/ReportDetails";

function Navigation() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/heatmap" element={<HeatMapPage />} />
        <Route path="/report-deatils/:reportId" element={<ReportDetails />} />
        <Route path="/authority-dash" element={<AuthorityDashboard />} />
        <Route path="/reports/:citizenId" element={<ParticularReports />} />
        <Route path="/pending-citizen-reports" element={<ShowingPendingReports />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default Navigation;
