import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FileText } from "lucide-react";

function CitizenList() {
  const [citizens, setCitizens] = useState([]);
  const navigate = useNavigate();

  const fetchCitizens = async (params) => {
    await axios
      .get("http://localhost:8383/citizen/getAll")
      .then((res) => {
        setCitizens(res.data);
      })
      .catch((err) => {
        err;
      });
  };

  useEffect(() => {
    fetchCitizens();
  }, []);

  const handleReportView = (reportId) => {
    sessionStorage.setItem("citizenId", reportId);
    navigate(`/show-report`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] p-4 sm:p-6">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-teal-300 drop-shadow-md">
        Citizen List
      </h2>
      <div className="bg-[#0a0a0a] rounded-xl p-5 shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="py-3 px-4 text-xs uppercase">Name</th>
              <th className="py-3 px-4 text-xs uppercase">Email</th>
              <th className="py-3 px-4 text-xs uppercase">Phone</th>
              <th className="py-3 px-4 text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {citizens.map((citizen, index) => (
              <tr
                key={citizen.id}
                className="hover:bg-gray-900 transition-colors duration-300 border-b border-gray-700"
              >
                <td className="py-3 px-4 text-lg font-semibold text-blue-300">
                  {citizen.name}
                </td>
                <td className="py-3 px-4 text-sm text-green-400">
                  {citizen.email}
                </td>
                <td className="py-3 px-4 text-sm text-orange-400">
                  {citizen.phoneNumber}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleReportView(citizen.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-[#fafafa] text-sm px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
                  >
                    <FileText size={18} />
                    See Reports
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CitizenList;
