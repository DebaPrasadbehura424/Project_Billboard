import { AlertTriangle, CheckCircle, Clock, MapPin } from "lucide-react";
import MapFilters from "../../component/hmComponent/MapFilters";
import MapLegend from "../../component/hmComponent/MapLegend";
import ViolationMapPage from "../../component/hmComponent/ViolationMapPage";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

function HeatMapPage() {
  const { authenticated, theme } = useAuth();
  const [originalReports, setOriginalReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [highRisk, setHighRisk] = useState(0);
  const [mediumRisk, setMediumRisk] = useState(0);
  const [lowRisk, setLowRisk] = useState(0);
  const [totalReports, setTotalReports] = useState([]);

  const isDark = theme === "dark";

  const fetchReportDetails = async () => {
    try {
      const res = await axios.get("http://localhost:8383/report/all");
      setOriginalReports(res.data);
      setFilteredReports(res.data);
    } catch (err) {
      console.log(err);
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
      const level = report.risk_level?.toLowerCase();
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
      <div
        className={`flex items-center justify-center min-h-screen text-lg font-semibold ${
          isDark ? "bg-[#0A0A0A] text-red-400" : "bg-gray-50 text-red-600"
        }`}
      >
        Unauthorized access — please log in first.
      </div>
    );
  }

  return (
    <div
      className={`mx-auto px-4 py-12 min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#0A0A0A] text-white" : "bg-gray-50 text-gray-900"
      }`}
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <h1 className="text-center font-bold text-3xl sm:text-4xl mb-4 tracking-wide">
        Public Violation Heatmap
      </h1>
      <p
        className={`text-center max-w-3xl mx-auto mb-12 leading-relaxed text-lg ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
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
            numberColor: isDark ? "text-white" : "text-gray-900",
          },
          {
            title: "Low Risk",
            value: lowRisk,
            desc: "Approved but low impact",
            icon: Clock,
            numberColor: "text-yellow-500",
          },
          {
            title: "Medium Risk",
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
            className={`rounded-xl p-6 flex flex-col justify-between min-h-[140px] transition hover:shadow-lg ${
              isDark
                ? "bg-[#121212] border border-gray-800 hover:shadow-blue-900/20"
                : "bg-white border border-gray-200 hover:shadow-blue-100"
            }`}
          >
            <div className="flex justify-between items-start">
              <p className="font-semibold text-sm">{item.title}</p>
              <item.icon
                className={isDark ? "text-gray-400" : "text-gray-500"}
                size={20}
              />
            </div>
            <div>
              <p
                className={`font-extrabold text-2xl mt-4 mb-1 ${item.numberColor}`}
              >
                {item.value}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Legend */}
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
