import { MapPin, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import MapFilters from "../../component/hmComponent/MapFilters";
import MapLegend from "../../component/hmComponent/MapLegend";
import ViolationMapPage from "../../component/hmComponent/ViolationMapPage";

function HeatMapPage() {
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
            value: 8,
            desc: "Reported locations",
            icon: MapPin,
            numberColor: "text-white",
          },
          {
            title: "High Risk",
            value: 3,
            desc: "Safety concerns",
            icon: AlertTriangle,
            numberColor: "text-red-500",
          },
          {
            title: "Pending",
            value: 3,
            desc: "Awaiting review",
            icon: Clock,
            numberColor: "text-yellow-400",
          },
          {
            title: "Confirmed",
            value: 2,
            desc: "Verified violations",
            icon: CheckCircle,
            numberColor: "text-green-500",
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
