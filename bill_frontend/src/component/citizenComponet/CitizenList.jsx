import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function CitizenList() {
  const [citizens, setCitizens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useAuth();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        const res = await axios.get("http://localhost:8383/citizen/getall");
        setCitizens(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching citizens:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCitizens();
  }, []);

  const handleReportView = (citizenId) => {
    navigate(`/show_report/${citizenId}`);
  };

  return (
    <div
      className={`min-h-screen px-6 py-10 transition-colors ${
        isDark ? "bg-[#0A0A0A] text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      <h1
        className={`text-4xl font-bold text-center mb-6 ${
          isDark ? "text-teal-300" : "text-teal-600"
        }`}
      >
        Citizen Watchlist
      </h1>

      <div
        className={`rounded-lg shadow-xl overflow-hidden border ${
          isDark ? "bg-[#111] border-[#333]" : "bg-white border-gray-200"
        }`}
      >
        {/* LOADING SKELETON */}
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-12 w-full rounded-lg animate-pulse ${
                  isDark ? "bg-[#1F2937]" : "bg-gray-200"
                }`}
              ></div>
            ))}
          </div>
        ) : citizens.length === 0 ? (
          // EMPTY STATE
          <div className="p-10 text-center">
            <p className="text-lg font-semibold">No Citizens Found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead
              className={`${
                isDark
                  ? "bg-[#1A1A1A] text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {citizens.map((citizen) => (
                <tr
                  key={citizen.id}
                  className={`border-b ${
                    isDark ? "border-[#333]" : "border-gray-200"
                  }`}
                >
                  <td className="p-3 font-semibold">{citizen.full_name}</td>
                  <td className="p-3">{citizen.email}</td>
                  <td className="p-3">{citizen.phone_number}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleReportView(citizen.id)}
                      className={`px-4 py-2 rounded-md text-white text-sm ${
                        isDark
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      View Reports
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CitizenList;
