import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ShowReports() {
  const { citizenId } = useParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8383/report/get_by_citizen/${citizenId}`,
      );

      setReports(res.data.reports || []);
    } catch (err) {
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (citizenId) {
      fetchReports();
    }
  }, [citizenId]);

  if (loading) {
    return (
      <div className="p-6 text-center text-lg font-semibold">
        Loading reports...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 text-lg font-semibold">
        {error}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 text-lg">
        No reports found for this citizen.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Citizen Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-4 bg-white shadow rounded-lg border"
          >
            <h2 className="text-xl font-bold">{report.title}</h2>

            <p className="text-gray-600 mt-1">
              <strong>Issue:</strong> {report.issue}
            </p>

            <p className="text-gray-600 mt-1">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-white ${
                  report.status === "pending"
                    ? "bg-yellow-500"
                    : report.status === "approved"
                      ? "bg-green-600"
                      : "bg-red-600"
                }`}
              >
                {report.status}
              </span>
            </p>

            <p className="text-gray-600 mt-1">
              <strong>Date:</strong>{" "}
              {new Date(report.created_at).toLocaleString()}
            </p>

            <p className="text-gray-600 mt-1">
              <strong>Address:</strong> {report.address}
            </p>

            <p className="text-gray-600 mt-1">
              <strong>Risk:</strong> {report.risk_level} (
              {report.risk_percentage}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowReports;
