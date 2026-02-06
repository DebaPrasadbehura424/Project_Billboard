import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  XCircle,
} from "lucide-react";

function CitizenReportsList({ reports, setReports }) {
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

  const { theme } = useAuth();

  const isDark = theme === "dark";

  const viewDetailsOfReports = (id) => {
    navigate(`/report_deatils/${id}`);
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const res = await fetch(`http://localhost:8383/report/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Delete failed: " + data.error);
        return;
      }

      alert("Report deleted successfully");

      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting report");
    }
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
          Reports
        </h2>
        <p
          className={`text-sm mt-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          History of all violation reports you've submitted
        </p>
      </div>

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
              {["Created_at", "Title", "Issue", "Address", "Status"].map(
                (head, idx) => (
                  <th
                    key={idx}
                    className={`p-4 text-sm font-semibold ${
                      isDark ? "text-[#E5E7EB]" : "text-gray-700"
                    }`}
                  >
                    {head}
                  </th>
                ),
              )}
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
                  {report?.created_at?.split("T")[0]}
                </td>
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
                    {report.issue}
                  </span>
                </td>
                <td
                  className={`p-4 max-w-[200px] truncate ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {report.address}
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
                    onClick={() => viewDetailsOfReports(report.id)}
                  >
                    View Details
                  </button>
                </td>
                <td className="p-4">
                  <button
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isDark
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-600 hover:text-red-800"
                    }`}
                    onClick={() => deleteReport(report.id)}
                  >
                    Delete
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
