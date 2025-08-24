import { useMemo } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

const RISK_COLORS = {
  high: "#ef4444", // red
  medium: "#f59e0b", // amber
  low: "#22c55e", // green
};

export default function ViolationMapPage({ reports }) {
  const center = useMemo(() => {
    if (!reports.length) return [20.5937, 78.9629]; // fallback: India
    const lat =
      reports.reduce(
        (sum, report) => sum + parseFloat(report.latitude || 0),
        0
      ) / reports.length;
    const lng =
      reports.reduce(
        (sum, report) => sum + parseFloat(report.longitude || 0),
        0
      ) / reports.length;
    return [lat, lng];
  }, [reports]);

  return (
    <div
      className="w-full h-screen flex flex-col"
      style={{
        background: "#0A0A0A",
        color: "#FAFAFA",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold leading-tight">
            Violation Map
          </h2>
          <p className="text-sm opacity-80">
            Showing <strong>{reports.length}</strong> reported violations.  
            Click markers for details.
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={true}
          style={{
            height: "100%",
            width: "100%",
            zIndex: 0,
          }}
        >
          {/* ✅ Switched to Carto Voyager basemap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains={["a", "b", "c", "d"]}
          />

          {reports &&
            reports.map((v) => {
              const risk = v.risk_level
                ? v.risk_level.toLowerCase()
                : "medium";
              return (
                <CircleMarker
                  key={v.id}
                  center={[
                    parseFloat(v.latitude || 0),
                    parseFloat(v.longitude || 0),
                  ]}
                  radius={10}
                  pathOptions={{
                    color: RISK_COLORS[risk],
                    fillColor: RISK_COLORS[risk],
                    fillOpacity: 0.9,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: 220, fontSize: "0.9rem" }}>
                      <h4 className="font-semibold text-base mb-1">
                        {v.title}
                      </h4>
                      <p className="text-sm">
                        <strong>Risk:</strong>{" "}
                        <span
                          style={{
                            color: RISK_COLORS[risk],
                            fontWeight: "600",
                          }}
                        >
                          {risk.charAt(0).toUpperCase() + risk.slice(1)}
                        </span>
                        <br />
                        <strong>Status:</strong> {v.status}
                        <br />
                        <strong>Category:</strong> {v.category}
                        <br />
                        <strong>Description:</strong> {v.description}
                        <br />
                        <strong>Reported On:</strong>{" "}
                        {new Date(v.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
}
