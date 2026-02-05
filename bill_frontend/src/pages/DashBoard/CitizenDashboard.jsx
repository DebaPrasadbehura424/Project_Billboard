import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import CitizenReport from "../Report/ReportForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CitizenReportsList from "../../component/citizenComponet/CitizenReportsList";

function CitizenDashboard() {
  const { theme } = useAuth();
  const isDark = theme === "dark";

  const [reports, setReports] = useState([]);
  const [approvedReports, setApprovedReports] = useState([]);
  const [PendingReports, setPendingReports] = useState([]);
  const [rejectedReports, setRejectedReports] = useState([]);
  const [totalReports, setTotalReports] = useState([]);

  const [citizen, setCitizen] = useState([]);
  const token = sessionStorage.getItem("citizen_token");
  const navigate = useNavigate();

  const fetchCitizenReportDetails = async () => {
    await axios
      .get("http://localhost:8383/citizen/getbyId", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const r = res.data?.reports;
        const c = res.data?.citizen;
        const x = res.data?.counts;
        setCitizen(c);
        setReports(r);
        setTotalReports(r.length);
        setPendingReports(x?.pending);
        setRejectedReports(x?.rejected);
        setApprovedReports(x?.approved);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    if (token) {
      fetchCitizenReportDetails();
    }
  }, [token]);

  return (
    <div
      className={`space-y-10 p-6 sm:p-8 lg:p-12 pt-16 min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#0A0A0A] text-[#E5E7EB]" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b pb-6 ${
          isDark ? "border-[#FAFAFA]/20" : "border-gray-300"
        }`}
      >
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Welcome back, {citizen?.full_name || "Unknown user"}
          </h1>
          <p
            className={`text-lg leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Track your violation reports and contribute to a compliant city
          </p>
        </div>
        <button
          onClick={() => setIsReportDialogOpen(true)}
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg border border-blue-500/50"
        >
          <Plus className="mr-2 h-5 w-5" />
          Report Violation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Reports",
            value: totalReports || 0,
            color: isDark ? "text-blue-400" : "text-blue-600",
            icon: (
              <FileText
                className={`h-5 w-5 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
            ),
            note: "All time submissions",
          },
          {
            label: "Pending",
            value: PendingReports || 0,
            color: isDark ? "text-yellow-400" : "text-yellow-600",
            icon: (
              <Clock
                className={`h-5 w-5 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
            ),
            note: "Awaiting review",
          },
          {
            label: "Approved",
            value: approvedReports || 0,
            color: isDark ? "text-green-400" : "text-green-600",
            icon: (
              <CheckCircle
                className={`h-5 w-5 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
            ),
            note: "Confirmed violations",
          },
          {
            label: "Rejected",
            value: rejectedReports || 0,
            color: isDark ? "text-red-400" : "text-red-600",
            icon: (
              <XCircle
                className={`h-5 w-5 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
            ),
            note: "Not violations",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border ${
              isDark
                ? "bg-[#0A0A0A]/90 border-[#FAFAFA]/20"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="flex flex-row items-center justify-between pb-3">
              <h3 className={`text-sm font-semibold ${stat.color}`}>
                {stat.label}
              </h3>
              {stat.icon}
            </div>
            <div className={`text-4xl font-extrabold ${stat.color}`}>
              {stat.value}
            </div>
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {stat.note}
            </p>
          </div>
        ))}
      </div>

      <CitizenReportsList reports={reports} />
    </div>
  );
}

export default CitizenDashboard;
