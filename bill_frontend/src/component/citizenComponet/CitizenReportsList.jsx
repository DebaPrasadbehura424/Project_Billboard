import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function CitizenReportsList({ getStatusIcon, getStatusColor }) {
  const navigate = useNavigate();

  const {
    setTotalReports,
    setPendingReports,
    setApprovedReports,
    setRejectedReports,
    reports,
    setReports,
    theme,
  } = useAuth();

  const isDark = theme === "dark";
  const citizenId = sessionStorage.getItem("citizenId");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!citizenId) return;

        const response = await axios.get(
          `http://localhost:8383/report/citizens/${citizenId}`
        );
        setReports(response.data || []);
      } catch (error) {
        console.error("Error fetching citizen reports:", error);
      }
    };

    fetchReports();
  }, [citizenId]);

  useEffect(() => {
    let pending = 0,
      approved = 0,
      rejected = 0;

    reports.forEach((report) => {
      if (report.status === "approved") approved++;
      else if (report.status === "pending") pending++;
      else if (report.status === "rejected") rejected++;
    });

    setTotalReports(reports.length);
    setApprovedReports(approved);
    setPendingReports(pending);
    setRejectedReports(rejected);
  }, [reports]);

  const handleReportNavigate = (id) => {
    sessionStorage.setItem("reportId", id);
    navigate(`/report-deatils/${id}`);
  };

  return (
    <div
      className={`${
        isDark
          ? "bg-[#0A0A0A]/90 text-[#E5E7EB] border border-[#FAFAFA]/20"
          : "bg-white text-gray-900 border border-gray-200"
      } backdrop-blur-md rounded-xl shadow-md overflow-hidden mb-6 mt-2`}
    >
      {/* Header */}
      <div
        className={`p-6 border-b ${
          isDark ? "border-[#FAFAFA]/20" : "border-gray-200"
        }`}
      >
        <h2
          className={`text-3xl font-extrabold ${
            isDark ? "text-[#E5E7EB]" : "text-gray-900"
          }`}
        >
          Your Reports
        </h2>
        <p
          className={`text-sm mt-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          History of all violation reports you've submitted
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead
            className={`${
              isDark
                ? "bg-[#0A0A0A]/95 border-b border-[#FAFAFA]/20"
                : "bg-gray-100 border-b border-gray-200"
            }`}
          >
            <tr>
              {[
                "Title",
                "Category",
                "Location",
                "Date",
                "Status",
                "Actions",
              ].map((head, idx) => (
                <th
                  key={idx}
                  className={`p-4 text-sm font-semibold ${
                    isDark ? "text-[#E5E7EB]" : "text-gray-700"
                  }`}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr
                key={index}
                className={`transition-colors duration-200 ${
                  isDark
                    ? "border-b border-[#FAFAFA]/20 hover:bg-[#0A0A0A]/70"
                    : "border-b border-gray-200 hover:bg-gray-50"
                }`}
              >
                <td
                  className={`p-4 font-medium ${
                    isDark ? "text-[#E5E7EB]" : "text-gray-900"
                  }`}
                >
                  {report?.title}
                </td>
                <td className="p-4">
                  <span
                    className={`capitalize inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      isDark
                        ? "text-[#E5E7EB] border border-[#FAFAFA]/20 bg-[#0A0A0A]/90"
                        : "text-gray-800 border border-gray-300 bg-gray-100"
                    }`}
                  >
                    {report.category}
                  </span>
                </td>
                <td
                  className={`p-4 max-w-[200px] truncate ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {report.location}
                </td>
                <td
                  className={`p-4 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {new Date(report.date).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      isDark
                        ? "border border-[#FAFAFA]/20"
                        : "border border-gray-300"
                    } ${getStatusColor(report.status)}`}
                  >
                    {getStatusIcon(report.status)}
                    <span className="capitalize">{report.status}</span>
                  </span>
                </td>
                <td className="p-4">
                  <button
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isDark
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                    onClick={() => handleReportNavigate(report.id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className={`p-4 text-center ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CitizenReportsList;
