import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

function NewViolation() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  const handleReportDetails = (id) => {
    sessionStorage.setItem("reportId", id);
    navigate(`/report-deatils/${id}`);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8383/report/unapproved_reports")
      .then((res) => setReports(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return {
          bg: "bg-teal-900",
          text: "text-teal-300",
          icon: <CheckCircle2 size={18} />,
        };
      case "pending":
        return {
          bg: "bg-yellow-900",
          text: "text-yellow-300",
          icon: <Clock size={18} />,
        };
      case "rejected":
        return {
          bg: "bg-red-900",
          text: "text-red-300",
          icon: <XCircle size={18} />,
        };
      default:
        return {
          bg: "bg-gray-900",
          text: "text-gray-300",
          icon: <Clock size={18} />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-3 sm:p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-5 text-center text-white">
        Pending Violation Reports
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {reports.map((r) => {
          const { bg, text, icon } = getStatusConfig(r.status);
          return (
            <div
              key={r.id}
              className="bg-gray-800 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-48"
            >
              <div className="flex-1">
                <h2 className="text-sm font-semibold truncate text-white">
                  {r.citizenName}
                </h2>
                <p className="mt-1 text-xs text-gray-400 truncate">{r.title}</p>
              </div>
              <div className="mt-2">
                <span
                  className={`${bg} ${text} flex items-center justify-center text-sm font-medium px-4 py-1 rounded-full border border-opacity-30 border-white shadow-neon`}
                >
                  {icon}
                  <span className="ml-2 capitalize">{r.status}</span>
                </span>
              </div>
              <div className="mt-3 flex gap-2 justify-center">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-full transition-all duration-200 relative overflow-hidden group"
                  onClick={() => console.log("Approve", r.id)}
                >
                  <span className="relative z-10">Approve</span>
                  <span className="absolute inset-0 bg-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 shine-effect"></span>
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full transition-all duration-200 relative overflow-hidden group"
                  onClick={() => console.log("Reject", r.id)}
                >
                  <span className="relative z-10">Reject</span>
                  <span className="absolute inset-0 bg-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 shine-effect"></span>
                </button>
              </div>
              <button
                onClick={() => handleReportDetails(r.id)}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full transition-all duration-200 relative overflow-hidden group"
              >
                <span className="relative z-10">View Details</span>
                <span className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 shine-effect"></span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NewViolation;
