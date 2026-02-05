import { Route, Router, Routes, useLocation } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import NavBar from "./component/pageComponet/Navbar";
import About from "./pages/About";
import Home from "./pages/Home";
import Footer from "./component/pageComponet/Footer";
import CitizenLogin from "./pages/auth/CitizenLogin";
import AuthorityLogin from "./pages/auth/AuthorityLogin";
import CitizenSignup from "./pages/auth/CitizenSignup";
import CitizenDashboard from "./pages/DashBoard/CitizenDashboard";
import AuthorityDashboard from "./pages/DashBoard/AuthorityDashboard";
import HeatMapPage from "./pages/HeatMap/HeatMapPage";
import ReelCoverage from "./pages/ReelReport/ReelCoverage";
import Profile from "./pages/profile/Profile";
import ReportDetails from "./pages/Report/ReportDetails";
import PageNotFound from "./pages/PageNotFound";
import ShowReports from "./pages/Report/ShowReports";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* intializes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* auth */}
        <Route path="/login/citizen" element={<CitizenLogin />} />
        <Route path="/login/authority" element={<AuthorityLogin />} />

        {/* signup */}
        <Route path="/signup/citizen" element={<CitizenSignup />} />

        {/* dashboard */}
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/authority-dashboard" element={<AuthorityDashboard />} />

        {/* heatmap */}
        <Route path="/heatmap" element={<HeatMapPage />} />

        {/* report */}
        <Route path="/report_deatils/:id" element={<ReportDetails />} />
        <Route path="/show_report/:citizenId" element={<ShowReports />} />

        {/* reelreport */}
        <Route path="/reelreport" element={<ReelCoverage />} />

        {/* leaderboard */}
        {/* <Route path="/leaderboard" element={<Leaderboard />} /> */}

        {/* profile */}
        <Route path="/profile" element={<Profile />} />

        {/* page not found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {<Footer />}
    </>
  );
}

export default App;
