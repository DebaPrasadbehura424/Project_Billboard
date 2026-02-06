import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ReportDetails() {
  const { id } = useParams(); // reportId from URL
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      const res = await axios.get(`http://localhost:8383/report/get_one/${id}`);

      setReport(res.data.report);
      setCitizen(res.data.citizen);
      setCitizen(res.data.citizen);
    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-xl font-semibold">
        Loading report details...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 text-center text-xl text-red-500 font-semibold">
        Report not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        ⬅ Back
      </button>

      <h1 className="text-3xl font-bold mb-4">Report Details</h1>

      {/* Report Info Card */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{report.title}</h2>
        <img src={report.photo} alt="img" className="w-1/2 h-1/2" />
        <p className="text-gray-700 mb-2">
          <strong>Issue:</strong> {report.issue}
        </p>
        <p className="text-gray-700 mb-2">
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

        <p className="text-gray-700 mb-2">
          <strong>Submitted On:</strong>{" "}
          {new Date(report.created_at).toLocaleString()}
        </p>

        <p className="text-gray-700 mb-2">
          <strong>Address:</strong> {report.address}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Risk Level:</strong> {report.risk_level}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Risk Percentage:</strong> {report.risk_percentage}%
        </p>

        <p className="text-gray-700">
          <strong>Location:</strong>
        </p>
        <p className="text-gray-600">Lat: {report.lat}</p>
        <p className="text-gray-600">Lng: {report.lng}</p>
      </div>

      {/* Citizen Info */}
      <div className="bg-white shadow p-6 rounded-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Citizen Information</h2>

        <p className="text-gray-700 mb-2">
          <strong>Name:</strong> {citizen?.full_name}
        </p>

        <p className="text-gray-700 mb-2">
          <strong>Email:</strong> {citizen?.email}
        </p>

        <p className="text-gray-700 mb-2">
          <strong>Phone:</strong> {citizen?.phone_number}
        </p>
      </div>
    </div>
  );
}

export default ReportDetails;
