import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Footer from "../component/pageComponet/Footer";
import NavBar from "../component/pageComponet/Navbar";
import About from "../pages/About";
import Signup from "../pages/auth/signups/Signup";
import CitizenDashboard from "../pages/DashBoard/CitizenDashboard";
import Home from "../pages/Home";
import HeatMapPage from "../pages/HeatMap/HeatMapPage";
import ReportDetails from "../pages/Report/ReportDetails";
import AuthorityDashboard from "../pages/DashBoard/AuthorityDashboard";
import NewViolation from "../pages/violation/NewViolation";
import ShowReports from "../pages/Report/ShowReports";
import CitizenLogin from "../pages/auth/logins/CitizenLogin";
import AuthorityLogin from "../pages/auth/logins/AuthorityLogin";
import ReelCoverage from "../pages/ReelReport/ReelCoverage";
import Leaderboard from "../pages/LB/Leaderboard";
import Profile from "../pages/profile/Profile";
import CitizenProfile from "../pages/profile/CitizenProfile";
import { useAuth } from "../context/AuthContext";

function Navigation() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* intializes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* auth */}
        <Route path="/login/citizen" element={<CitizenLogin />} />
        <Route path="/login/authority" element={<AuthorityLogin />} />

        {/* signup */}
        <Route path="/signup" element={<Signup />} />

        {/* dashboard */}
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/authority-dashboard" element={<AuthorityDashboard />} />

        {/* heatmap */}
        <Route path="/heatmap" element={<HeatMapPage />} />

        {/* report */}
        <Route path="/report-deatils/:id" element={<ReportDetails />} />
        <Route path="/show-report" element={<ShowReports />} />

        {/* violation */}
        <Route path="/new_violation" element={<NewViolation />} />

        {/* reelreport */}
        <Route path="/reelreport" element={<ReelCoverage />} />

        {/* leaderboard */}
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* profile */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/citizenprofile" element={<CitizenProfile />} />
      </Routes>
      {<Footer />}
    </Router>
  );
}

export default Navigation;
