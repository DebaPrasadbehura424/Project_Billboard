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
import CitizenReport from "../Report/CitizenReport";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CitizenReportsList from "../../component/citizenComponet/CitizenReportsList";

function CitizenDashboard() {
  const {
    authenticated,
    setAuthenticated,
    totalReports,
    pendingReports,
    approvedReports,
    rejectedReports,
    theme,
  } = useAuth();
  const isDark = theme === "dark";

  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [citizen, setCitizen] = useState([]);
  const token = localStorage.getItem("citizen_token");
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "under-review":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return isDark
          ? "bg-yellow-900/30 text-yellow-400 border-yellow-500/40 hover:bg-yellow-900/50"
          : "bg-yellow-100 text-yellow-600 border-yellow-300 hover:bg-yellow-200";
      case "approved":
        return isDark
          ? "bg-green-900/30 text-green-400 border-green-500/40 hover:bg-green-900/50"
          : "bg-green-100 text-green-600 border-green-300 hover:bg-green-200";
      case "rejected":
        return isDark
          ? "bg-red-900/30 text-red-400 border-red-500/40 hover:bg-red-900/50"
          : "bg-red-100 text-red-600 border-red-300 hover:bg-red-200";
      case "under-review":
        return isDark
          ? "bg-orange-900/30 text-orange-400 border-orange-500/40 hover:bg-orange-900/50"
          : "bg-orange-100 text-orange-600 border-orange-300 hover:bg-orange-200";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  const fetchCitizenDetails = async () => {
    try {
      const response = await axios.get("http://localhost:8383/citizen/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCitizen(response.data);

      const citizenId = response.data?.id;
      const name = response.data?.name;

      sessionStorage.setItem("citizenId", citizenId);
      sessionStorage.setItem("citizen_name", name);
    } catch (error) {
      console.error("Error fetching citizen details:", error);
      if (error.response?.status === 401) {
        setAuthenticated(false);
        navigate("/");
      }
    }
  };

  useEffect(() => {
    if (!authenticated) {
      setAuthenticated(true);
      navigate("/citizen-dashboard");
    }

    if (token) {
      fetchCitizenDetails();
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
            Welcome back, {citizen?.name || "Unknown user"}
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
            value: totalReports,
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
            value: pendingReports,
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
            value: approvedReports,
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
            value: rejectedReports,
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
              <h3
                className={`text-sm font-semibold ${
                  isDark ? "text-[#E5E7EB]" : "text-gray-800"
                }`}
              >
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

      {/* Reports History */}
      <CitizenReportsList
        getStatusIcon={getStatusIcon}
        getStatusColor={getStatusColor}
      />

      {/* Report Violation Modal */}
      <CitizenReport
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
    </div>
  );
}

export default CitizenDashboard;
