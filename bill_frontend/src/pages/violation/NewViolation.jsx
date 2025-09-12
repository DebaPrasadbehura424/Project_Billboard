import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function NewViolation() {
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useAuth();

  const isDark = theme === "dark";

  useEffect(() => {
    const fetchPendingReports = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8383/report/unapproved_reports"
        );
        setPendingReports(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReports();
  }, []);

  const viewDetailsForpending = (id) => {
    sessionStorage.setItem("reportId", id);
    navigate(`/report-deatils/${id}`);
  };

  const updateStatus = async (citizenId, id, status) => {
    console.log(citizenId);
    console.log(id);
    console.log(status);

    try {
      const res = await axios.patch(
        `http://localhost:8383/report/updateStatus/${id}/${citizenId}`,
        { status }
      );
      if (res.status === 200) {
        if (status === "approved") {
          setPendingReports((prev) => prev.filter((r) => r.id !== id));
        } else if (status === "rejected") {
          setPendingReports((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
          );
        }
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen text-lg transition-colors duration-500 ${
          isDark ? "text-gray-400 bg-[#0A0A0A]" : "text-gray-600 bg-gray-50"
        }`}
      >
        ⏳ Loading pending reports...
      </div>
    );
  }

  return (
    <div
      className={`p-8 min-h-screen transition-colors duration-500 ${
        isDark ? "bg-[#0D0D0D]" : "bg-gray-50"
      }`}
    >
      <h1
        className={`text-4xl font-extrabold mb-10 text-center tracking-tight ${
          isDark ? "text-teal-300" : "text-teal-700"
        }`}
      >
        🚨 Pending Reports Dashboard
      </h1>

      {pendingReports.length === 0 ? (
        <p
          className={`text-center text-lg ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          ✅ No pending reports found 🎉
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pendingReports.map((report, idx) => (
            <div
              key={idx}
              className={`rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between border backdrop-blur-sm transform hover:-translate-y-1 ${
                isDark
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
              style={{
                animation: `fadeIn 0.4s ease-out ${idx * 0.1}s forwards`,
              }}
            >
              {/* Report Header */}
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
                      : report.status === "rejected"
                      ? "bg-red-500/80 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {report.status}
                </span>
                <p
                  className={`text-sm mt-2 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {report.category}
                </p>
              </div>

              {/* Report Details Preview */}
              <div className="mt-4">
                <p
                  className={`truncate ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {report.location}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  📅 {new Date(report.date).toLocaleDateString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => viewDetailsForpending(report.id)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  View Details
                </button>
                <button
                  onClick={() =>
                    updateStatus(report.citizenId, report.id, "approved")
                  }
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isDark
                      ? "bg-green-600 hover:bg-green-500 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    updateStatus(report.citizenId, report.id, "rejected")
                  }
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isDark
                      ? "bg-red-600 hover:bg-red-500 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
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
