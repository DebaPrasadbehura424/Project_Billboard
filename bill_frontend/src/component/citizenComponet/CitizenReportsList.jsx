import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function CitizenReportsList({ getStatusIcon, getStatusColor }) {
  const navigate = useNavigate();

  //
  const {
    setTotalReports,
    setPendingReports,
    setApprovedReports,
    setRejectedReports,
    reports,
    setReports,
  } = useAuth();

  const citizenId = sessionStorage.getItem("citizenId");
  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!citizenId) {
          console.warn("No citizenId found in sessionStorage.");
          return;
        }

        const response = await axios.get(
          `http://localhost:8383/report/citizens/${citizenId}`
        );

        setReports(response.data || []);
      } catch (error) {
        console.error("Error fetching citizen reports:", error);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    // Safely calculate counts
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    reports.forEach((report) => {
      if (report.status === "approved") approved++;
      else if (report.status === "pending") pending++;
      else if (report.status === "rejected") rejected++;
    });

    // Update all at once
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
    <div className="bg-[#0A0A0A]/90 backdrop-blur-md rounded-xl shadow-md overflow-hidden border border-[#FAFAFA]/20 mb-6 mt-2">
      <div className="p-6 border-b border-[#FAFAFA]/20">
        <h2 className="text-3xl font-extrabold text-[#E5E7EB]">Your Reports</h2>
        <p className="text-sm text-gray-400 mt-2">
          History of all violation reports you've submitted
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#0A0A0A]/95 border-b border-[#FAFAFA]/20">
            <tr>
              <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                Title
              </th>
              <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                Category
              </th>
              <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                Location
              </th>
              <th className="p-4 text-sm font-semibold text-[#E5E7EB]">Date</th>
              <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                Status
              </th>
              <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr
                key={index}
                className="border-b border-[#FAFAFA]/20 hover:bg-[#0A0A0A]/70 transition-colors duration-200"
              >
                <td className="p-4 font-medium text-[#E5E7EB]">
                  {report.title}
                </td>
                <td className="p-4">
                  <span className="capitalize inline-block px-3 py-1 text-xs font-medium text-[#E5E7EB] border border-[#FAFAFA]/20 rounded-full bg-[#0A0A0A]/90">
                    {report.category}
                  </span>
                </td>
                <td className="p-4 max-w-[200px] truncate text-gray-300">
                  {report.location}
                </td>
                <td className="p-4 text-gray-300">
                  {new Date(report.date).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-[#FAFAFA]/20 ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {getStatusIcon(report.status)}
                    <span className="capitalize">{report.status}</span>
                  </span>
                </td>
                <td className="p-4">
                  <button
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                    onClick={() => handleReportNavigate(report.id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-400">
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
