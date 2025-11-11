import { AlertTriangle, CheckCircle, Clock, MapPin } from "lucide-react";
import MapFilters from "../../component/hmComponent/MapFilters";
import MapLegend from "../../component/hmComponent/MapLegend";
import ViolationMapPage from "../../component/hmComponent/ViolationMapPage";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import indiaData from "../../jsonfiles/indianData.json";

function HeatMapPage() {
  const { authenticated, theme } = useAuth();
  const [originalReports, setOriginalReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [highRisk, setHighRisk] = useState(0);
  const [mediumRisk, setMediumRisk] = useState(0);
  const [lowRisk, setLowRisk] = useState(0);
  const [totalReports, setTotalReports] = useState(0);

  const isDark = theme === "dark";

  const fetchReportDetails = async () => {
    try {
      const res = await axios.get("http://localhost:8383/report/all");
      const apiReports = res.data.map((r) => ({
        id: r.id || crypto.randomUUID(),
        latitude: parseFloat(r.latitude),
        longitude: parseFloat(r.longitude),
        risk_level: r.risk_level || "Low",
      }));

      const jsonReports = indiaData.features.map((f, idx) => ({
        id: `json-${idx}`,
        latitude: parseFloat(f.coordinates.lat),
        longitude: parseFloat(f.coordinates.lng),
        risk_level: f.riskLevel || "Low",
      }));

      const combined = [...apiReports, ...jsonReports];
      setOriginalReports(combined);
      setFilteredReports(combined);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReportDetails();
  }, []);

  useEffect(() => {
    let high = 0,
      medium = 0,
      low = 0;
    originalReports.forEach((r) => {
      const lvl = r.risk_level?.toLowerCase();
      if (lvl === "high") high++;
      else if (lvl === "medium") medium++;
      else if (lvl === "low") low++;
    });
    setHighRisk(high);
    setMediumRisk(medium);
    setLowRisk(low);
    setTotalReports(originalReports.length);
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
        city. Data includes real-time reports and predicted risk points across
        India.
      </p>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
          {
            title: "Total Violations",
            value: totalReports,
            desc: "All reported & predicted points",
            icon: MapPin,
            numberColor: isDark ? "text-white" : "text-gray-900",
          },
          {
            title: "Low Risk",
            value: lowRisk,
            desc: "Low severity cases",
            icon: Clock,
            numberColor: "text-green-500",
          },
          {
            title: "Medium Risk",
            value: mediumRisk,
            desc: "Moderate concern",
            icon: CheckCircle,
            numberColor: "text-yellow-500",
          },
          {
            title: "High Risk",
            value: highRisk,
            desc: "Critical violations",
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

      {/* Filters & Map */}
      <MapFilters
        originalReports={originalReports}
        setReports={setFilteredReports}
      />
      <ViolationMapPage reports={filteredReports} />
      <MapLegend />
    </div>
  );
}

export default HeatMapPage;
