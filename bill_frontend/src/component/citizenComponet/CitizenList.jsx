import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function CitizenList() {
  const [citizens, setCitizens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useAuth();

  const fetchCitizens = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:8383/citizen/getAll");
      setCitizens(res.data);
    } catch (err) {
      console.error("Error fetching citizens:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, []);

  const handleReportView = (reportId) => {
    sessionStorage.setItem("citizenId", reportId);
    navigate(`/show-report`);
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen px-4 sm:px-6 md:px-8 py-8 transition-colors duration-500 ${
        isDark ? "bg-[#0A0A0A] text-[#E5E7EB]" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="fade-in text-center mb-12">
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg ${
            isDark ? "text-teal-300" : "text-teal-600"
          }`}
        >
          Citizen Watchlist
        </h2>
        <p
          className={`mt-3 text-base sm:text-lg font-medium max-w-3xl mx-auto ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Monitor all registered citizens and their violation reports
        </p>
      </div>

      {/* Table Container */}
      <div
        className={`w-full rounded-xl shadow-2xl border p-4 sm:p-6 overflow-x-auto backdrop-blur-md transition-colors duration-500 ${
          isDark
            ? "bg-[#0A0A0A]/80 border-[#FAFAFA]/10"
            : "bg-white border-gray-200"
        }`}
      >
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 h-16 animate-pulse ${
                  isDark ? "bg-[#1F2937]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        ) : citizens.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className={`mx-auto h-12 w-12 mb-4 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <p
              className={`text-lg font-semibold ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              No Citizens Registered
            </p>
            <p
              className={`text-sm ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              The watchlist is empty. Check back later!
            </p>
          </div>
        ) : (
          <div className="w-full">
            {/* Table Head */}
            <div
              className={`hidden md:grid grid-cols-3 gap-3 px-4 py-3 text-sm font-medium uppercase tracking-wider border-b ${
                isDark
                  ? "text-gray-400 border-[#2D2D2D]"
                  : "text-gray-600 border-gray-200"
              }`}
            >
              <div>Name</div>
              <div>Email</div>
              <div>Phone</div>
            </div>

            {/* Table Rows */}
            <div
              className={`divide-y ${
                isDark ? "divide-[#2D2D2D]" : "divide-gray-200"
              }`}
            >
              {citizens.map((citizen, index) => (
                <div
                  key={citizen.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center px-4 py-3 card"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                  }}
                >
                  {/* Name */}
                  <div
                    className={`text-sm font-semibold truncate ${
                      isDark ? "text-blue-300" : "text-blue-600"
                    }`}
                  >
                    {citizen.name}
                  </div>

                  {/* Email */}
                  <div
                    className={`text-sm truncate ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {citizen.email}
                  </div>

                  {/* Phone + Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span
                      className={`text-sm ${
                        isDark ? "text-orange-400" : "text-orange-600"
                      }`}
                    >
                      {citizen.phoneNumber}
                    </span>
                    <button
                      onClick={() => handleReportView(citizen.id)}
                      className={`text-sm font-medium py-1.5 px-3 rounded-lg flex items-center gap-2 justify-center transition ${
                        isDark
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Reports
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CitizenList;
