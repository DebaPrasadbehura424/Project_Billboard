import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function NewViolation({ reports, setShowViolation }) {
  const navigate = useNavigate();
  const { theme } = useAuth();
  const isDark = theme === "dark";

  const [pendingReportsFile, setPendingReportsFile] = useState([]);

  useEffect(() => {
    if (!reports) return;

    const filtered = reports.filter((report) => report.status === "pending");
    setPendingReportsFile(filtered);
  }, [reports]);

  const viewDetailsOfReports = (id) => {
    navigate(`/report_deatils/${id}`);
  };

  const updateStatus = async (reportId, status) => {
    try {
      const res = await axios.patch(
        "http://localhost:8383/report/update_status",
        { status, reportId },
      );

      if (res.status === 200) {
        const filterReports = pendingReportsFile.filter(
          (r) => r.id !== reportId,
        );
        setPendingReportsFile(filterReports);
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div
      className={`p-8 min-h-screen transition-colors duration-500 ${
        isDark ? "bg-[#0D0D0D]" : "bg-gray-50"
      }`}
    >
      <button
        onClick={() => setShowViolation(false)}
        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
          isDark
            ? "bg-purple-600 hover:bg-purple-500 text-white"
            : "bg-purple-500 hover:bg-purple-600 text-white"
        }`}
      >
        Back
      </button>

      <h1
        className={`text-4xl font-extrabold mb-10 text-center tracking-tight ${
          isDark ? "text-teal-300" : "text-teal-700"
        }`}
      >
        🚨 Pending Reports Dashboard
      </h1>

      {pendingReportsFile.length === 0 ? (
        <p
          className={`text-center text-lg ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          ✅ No pending reports found 🎉
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pendingReportsFile.map((report, idx) => (
            <div
              key={report.id}
              className={`rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between border ${
                isDark
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div>
                <h3
                  className={`text-2xl font-semibold mb-2 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  {report.title}
                </h3>

                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                    report.status === "pending"
                      ? "bg-yellow-500/80 text-white"
                      : report.status === "approved"
                        ? "bg-green-500/80 text-white"
                        : "bg-red-500/80 text-white"
                  }`}
                >
                  {report.status}
                </span>

                <p
                  className={`text-sm mt-2 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {report.address}
                </p>
              </div>

              <p
                className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {report.issue}
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => viewDetailsOfReports(report.id)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-500"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
                >
                  View Details
                </button>

                <button
                  onClick={() => updateStatus(report.id, "approved")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isDark
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white`}
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(report.id, "rejected")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isDark
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white`}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NewViolation;
