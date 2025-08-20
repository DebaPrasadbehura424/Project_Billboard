import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NewViolation() {
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [] = useState(null);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-lg">
        ⏳ Loading pending reports...
      </div>
    );
  }

  const viewDetailsForpending = (id) => {
    sessionStorage.setItem("reportId", id);
    navigate(`/report-deatils/${id}`);
  };

  const updateStatus = async (id, status) => {
    console.log(id);
    console.log(status);

    await axios
      .patch(`http://localhost:8383/report/updateStatus/${id}`, {
        status: status,
      })
      .then((res) => {
        if (res.status == 200) {
          alert("updated");
          if (status === "approved") {
            const filtered = pendingReports.filter((data) => data.id !== id);
            setPendingReports(filtered);
          } else if (status === "rejected") {
            const updated = pendingReports.map((report) =>
              report.id === id ? { ...report, status: "rejected" } : report
            );
            setPendingReports(updated);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="p-8 bg-[#0D0D0D] min-h-screen">
      <h1 className="text-4xl font-extrabold text-[#F5F5F5] mb-8 text-center">
        🚨 Pending Reports Dashboard
      </h1>

      {pendingReports.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          ✅ No pending reports found 🎉
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pendingReports.map((report) => (
            <div
              key={report.id}
              className="bg-gradient-to-br from-[#1F2937] to-[#111827] border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between"
            >
              {/* Report Header */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {report.title}
                </h3>
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full text-white
    ${
      report.status === "pending"
        ? "bg-yellow-600"
        : report.status === "approved"
        ? "bg-green-600"
        : report.status === "rejected"
        ? "bg-red-600"
        : "bg-gray-600"
    }`}
                >
                  {report.status}
                </span>

                <p className="text-sm text-gray-400 mt-2">{report.category}</p>
              </div>

              {/* Report Details Preview */}
              <div className="mt-4">
                <p className="text-gray-300 truncate">{report.location}</p>
                <p className="text-xs text-gray-500 mt-1">
                  📅 {new Date(report.date).toLocaleDateString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => viewDetailsForpending(report.id)}
                  className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                >
                  View Details
                </button>
                <button
                  onClick={() => updateStatus(report.id, "approved")}
                  className="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(report.id, "rejected")}
                  className="flex-1 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
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
