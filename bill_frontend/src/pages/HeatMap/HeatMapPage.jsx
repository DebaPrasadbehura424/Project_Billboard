import { AlertTriangle, CheckCircle, Clock, MapPin } from "lucide-react";
import MapFilters from "../../component/hmComponent/MapFilters";
import MapLegend from "../../component/hmComponent/MapLegend";
import ViolationMapPage from "../../component/hmComponent/ViolationMapPage";
import { useAuth } from "../../middleware/AuthController";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
function HeatMapPage() {
  const { authenticated } = useAuth();
  const [reports, setReports] = useState([]);
  const [approvedReports, setApprovedReports] = useState([]);
  const [PendingReports, setPendingReports] = useState([]);
  const [rejectedReports, setRejectedReports] = useState([]);
  const [totalReports, setTotalReports] = useState([]);

  const fetchReportDetails = async () => {
    await axios
      .get("http://localhost:8383/report/all")
      .then((res) => {
        setReports(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchReportDetails();
  }, []);

  useEffect(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    reports.forEach((report) => {
      if (report.status === "approved") approved++;
      else if (report.status === "pending") pending++;
      else if (report.status === "rejected") rejected++;
    });

    setTotalReports(reports.length);
    setApprovedReports(approved);
    setPendingReports(pending);
    setRejectedReports(rejected);
  }, [reports]);

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-red-400 text-lg font-semibold">
        Unauthorized access — please log in first.
      </div>
    );
  }

  return (
    <div
      className="mx-auto px-4 py-12 bg-[#0A0A0A] text-white min-h-screen"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <h1 className="text-center font-bold text-3xl sm:text-4xl mb-4 tracking-wide">
        Public Violation Heatmap
      </h1>
      <p className="text-center text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed text-lg">
        Interactive map showing all reported billboard violations across the
        city. Help keep your community compliant by viewing and reporting
        violations in your area.
      </p>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
          {
            title: "Total Violations",
            value: totalReports,
            desc: "All reported violations",
            icon: MapPin,
            numberColor: "text-white",
          },
          {
            title: "Low Risk",
            value: approvedReports,
            desc: "Approved but low impact",
            icon: Clock,
            numberColor: "text-yellow-400",
          },
          {
            title: "Midium Risk",
            value: rejectedReports,
            desc: "Rejected or unclear violations",
            icon: CheckCircle,
            numberColor: "text-green-500",
          },
          {
            title: "High Risk",
            value: PendingReports,
            desc: "Pending critical reviews",
            icon: AlertTriangle,
            numberColor: "text-red-500",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="border border-gray-800 rounded-xl p-6 flex flex-col justify-between min-h-[140px] bg-[#121212] hover:shadow-lg hover:shadow-blue-900/20 transition"
          >
            <div className="flex justify-between items-start">
              <p className="font-semibold text-sm">{item.title}</p>
              <item.icon className="text-gray-400" size={20} />
            </div>
            <div>
              <p
                className={`font-extrabold text-2xl mt-4 mb-1 ${item.numberColor}`}
              >
                {item.value}
              </p>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Legend */}
      <MapFilters />
      <ViolationMapPage />
      <MapLegend />
    </div>
  );
}

export default HeatMapPage;
