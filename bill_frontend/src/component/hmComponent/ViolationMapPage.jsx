import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

const RISK_COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

export default function ViolationMapPage({ reports }) {
  const { theme } = useAuth();
  const isDark = theme === "dark";

  const center = useMemo(() => {
    if (!reports?.length) return [20.5937, 78.9629]; // India center
    const lat =
      reports.reduce((sum, r) => sum + parseFloat(r.latitude || 0), 0) /
      reports.length;
    const lng =
      reports.reduce((sum, r) => sum + parseFloat(r.longitude || 0), 0) /
      reports.length;
    return [lat, lng];
  }, [reports]);

  return (
    <div
      className={`min-h-screen flex justify-center items-start py-4 transition-colors duration-300 ${
        isDark ? "bg-[#0A0A0A] text-[#FAFAFA]" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-8xl rounded-[10px] p-4 space-y-6 border transition-colors duration-300 ${
          isDark ? "border-gray-700 bg-[#121212]" : "border-gray-200 bg-white"
        }`}
      >
        <h2
          className={`text-lg sm:text-xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Violation Locations ({reports?.length || 0})
        </h2>

        <div className="w-full px-4" style={{ height: "80vh" }}>
          <MapContainer
            center={center}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {reports.map((v) => (
              <CircleMarker
                key={v.id}
                center={[v.latitude, v.longitude]}
                radius={8}
                pathOptions={{
                  color: RISK_COLORS[v.risk_level?.toLowerCase()] || "#3b82f6",
                  fillColor:
                    RISK_COLORS[v.risk_level?.toLowerCase()] || "#3b82f6",
                  fillOpacity: 0.8,
                  weight: 1.5,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">
                      Risk Level:{" "}
                      <span className="capitalize">{v.risk_level}</span>
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
