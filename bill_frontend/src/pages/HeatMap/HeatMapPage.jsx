import axios from "axios";
import { AlertTriangle, CheckCircle, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import MapFilters from "../../component/hmComponent/MapFilters";
import MapLegend from "../../component/hmComponent/MapLegend";
import ViolationMapPage from "../../component/hmComponent/ViolationMapPage";
import { useAuth } from "../../middleware/AuthController";

function HeatMapPage() {
  const { authenticated } = useAuth();

  const [originalReports, setOriginalReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [highRisk, setHighRisk] = useState(0);
  const [mediumRisk, setMediumRisk] = useState(0);
  const [lowRisk, setLowRisk] = useState(0);
  const [totalReports, setTotalReports] = useState(0); // ✅ number, not array

  const fetchReportDetails = async () => {
    try {
      const res = await axios.get("http://localhost:2000/api/violations");
      if (Array.isArray(res.data)) {
        setOriginalReports(res.data);
        setFilteredReports(res.data);
      } else {
        setOriginalReports([]);
        setFilteredReports([]);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchReportDetails();
  }, []);

  useEffect(() => {
    let high = 0;
    let medium = 0;
    let low = 0;

    originalReports.forEach((report) => {
      const level = (report.risk_level || "").toLowerCase(); // ✅ safe handling
      if (level === "high") high++;
      else if (level === "medium") medium++;
      else if (level === "low") low++;
    });

    setTotalReports(originalReports.length);
    setHighRisk(high);
    setMediumRisk(medium);
    setLowRisk(low);
  }, [originalReports]);

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

      {/* Stats Section */}
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
            value: lowRisk,
            desc: "Approved but low impact",
            icon: Clock,
            numberColor: "text-yellow-400",
          },
          {
            title: "Medium Risk", // ✅ fixed spelling
            value: mediumRisk,
            desc: "Rejected or unclear violations",
            icon: CheckCircle,
            numberColor: "text-green-500",
          },
          {
            title: "High Risk",
            value: highRisk,
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

      {/* Filters and Map */}
      <MapFilters
        originalReports={originalReports}
        setReports={setFilteredReports}
      />
      <ViolationMapPage
        reports={filteredReports}
        setReports={setFilteredReports}
      />

      <MapLegend />
    </div>
  );
}

export default HeatMapPage;
