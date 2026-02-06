import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

function ReelCoverage() {
  const { theme } = useAuth();
  const isDark = theme === "dark";
  const pic = "https://i.pravatar.cc/50";

  const [reports, setReports] = useState([]);

  const getAllReports = async () => {
    try {
      const response = await axios.get("http://localhost:8383/report/get_all");

      setReports(response.data.reports);
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
    }
  };

  useEffect(() => {
    getAllReports();
  }, []);

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark ? "bg-[#0b0b0c] text-gray-100" : "bg-gray-100 text-gray-900"
      } transition-colors duration-300`}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* If no reports */}
        {reports.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-20">
            No reports found or API returned empty.
          </p>
        )}

        {reports.map((report, index) => (
          <div
            key={report.id || index}
            className={`rounded-2xl shadow-lg p-6 border ${
              isDark
                ? "bg-[#141416] border-gray-700"
                : "bg-white border-gray-200"
            } transition-transform duration-300 hover:scale-[1.01]`}
          >
            <div className="mb-4">
              <img src={report.photo} alt="image" />
            </div>

            <h2 className="text-xl font-semibold">
              {report.title || "No title"}
            </h2>

            {/* Address */}
            <p className="text-sm text-gray-400 mt-1">
              📍 {report.address || "No address"}
            </p>

            {/* Issue */}
            <p className="mt-3 text-sm">
              {report.issue || "No issue provided"}
            </p>

            {/* Risk + Status */}
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-3 py-1 text-xs rounded-full bg-red-500 text-white">
                Risk: {report.risk_level || "N/A"}
              </span>

              <span className="px-3 py-1 text-xs rounded-full bg-blue-600 text-white">
                Status: {report.status || "N/A"}
              </span>

              <span className="px-3 py-1 text-xs rounded-full bg-purple-600 text-white">
                Risk %: {report.risk_percentage || "N/A"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReelCoverage;
