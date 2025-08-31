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
    if (!reports.length) return [20.5937, 78.9629];
    const lat =
      reports.reduce((sum, report) => sum + parseFloat(report.latitude), 0) /
      reports.length;
    const lng =
      reports.reduce((sum, report) => sum + parseFloat(report.longitude), 0) /
      reports.length;
    return [lat, lng];
  }, [reports]);

  return (
    <div
      className={`min-h-screen flex justify-center items-start py-4 transition-colors duration-300 ${
        isDark ? "bg-[#0A0A0A] text-[#FAFAFA]" : "bg-gray-50 text-gray-900"
      }`}
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div
        className={`w-full max-w-8xl rounded-[10px] p-4 space-y-6 border transition-colors duration-300 ${
          isDark ? "border-gray-700 bg-[#121212]" : "border-gray-200 bg-white"
        }`}
      >
        <div>
          <h2
            className={`text-lg sm:text-xl font-bold leading-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Violation Locations ({reports?.length || 0})
          </h2>
          <p
            className={`text-sm sm:text-base mt-1 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Click on map markers to view violation details. Red markers indicate
            high-risk violations.
          </p>
        </div>

        {/* Map Section */}
        <div className="w-full px-4" style={{ height: "80vh" }}>
          <MapContainer
            center={center}
            zoom={12}
            scrollWheelZoom={true}
            style={{
              height: "100%",
              width: "100%",
              overflow: "hidden",
              zIndex: 0,
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {reports &&
              reports.map((v) => (
                <CircleMarker
                  key={v.id}
                  center={[parseFloat(v.latitude), parseFloat(v.longitude)]}
                  radius={9}
                  pathOptions={{
                    color: RISK_COLORS[v.risk_level.toLowerCase()],
                    fillColor: RISK_COLORS[v.risk_level.toLowerCase()],
                    fillOpacity: 0.9,
                    weight: 1.5,
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: 200 }}>
                      <h4
                        style={{
                          margin: 0,
                          fontWeight: 700,
                          color: isDark ? "#fff" : "#111",
                        }}
                      >
                        {v.name}
                      </h4>
                      <p
                        style={{
                          margin: "6px 0 0 0",
                          fontSize: 12,
                          color: isDark ? "#ddd" : "#333",
                        }}
                      >
                        <strong>Risk:</strong>{" "}
                        {v.title.charAt(0).toUpperCase() + v.title.slice(1)}
                        <br />
                        <strong>Status:</strong> {v.status}
                        <br />
                        <strong>Category:</strong> {v.category}
                        <br />
                        <strong>Description:</strong> {v.description}
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
