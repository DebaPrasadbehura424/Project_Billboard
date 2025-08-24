import { useMemo } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

const RISK_COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

export default function ViolationMapPage({ reports }) {
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
      className="min-h-screen flex justify-center items-start py-4"
      style={{
        background: "#0A0A0A",
        color: "#FAFAFA",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="w-full max-w-8xl border-[1px] border-[#d8d8d8] rounded-[10px] p-4 space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold leading-tight">
            Violation Locations (8)
          </h2>
          <p className="text-sm sm:text-base opacity-80 mt-1">
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
                    color: RISK_COLORS[v.risk_level],
                    fillColor: RISK_COLORS[v.risk_level.toLowerCase()],
                    fillOpacity: 0.9,
                    weight: 1.5,
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: 200 }}>
                      <h4 style={{ margin: 0, fontWeight: 700 }}>{v.name}</h4>
                      <p style={{ margin: "6px 0 0 0", fontSize: 12 }}>
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