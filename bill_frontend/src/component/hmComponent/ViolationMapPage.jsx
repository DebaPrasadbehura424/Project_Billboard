import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const VIOLATIONS = [
  {
    id: 1,
    name: "Unauthorized Billboard - Andheri",
    position: [19.1197, 72.8468],
    risk: "high",
    status: "Pending",
    category: "Placement",
  },
  {
    id: 2,
    name: "Oversized Hoarding - Bandra",
    position: [19.0607, 72.8365],
    risk: "medium",
    status: "Under Review",
    category: "Size",
  },
  {
    id: 3,
    name: "Faded Content - Dadar",
    position: [19.0176, 72.8562],
    risk: "low",
    status: "Approved",
    category: "Content",
  },
  {
    id: 4,
    name: "Obstructing Signal - Worli",
    position: [19.0033, 72.817],
    risk: "high",
    status: "Pending",
    category: "Hazard",
  },
  {
    id: 5,
    name: "Improper Placement - Colaba",
    position: [18.9067, 72.8147],
    risk: "medium",
    status: "Under Review",
    category: "Placement",
  },
  {
    id: 6,
    name: "No Permit - Powai",
    position: [19.1176, 72.904],
    risk: "high",
    status: "Rejected",
    category: "Placement",
  },
  {
    id: 7,
    name: "Lighting Issue - Malad",
    position: [19.186, 72.8487],
    risk: "low",
    status: "Approved",
    category: "Hazard",
  },
  {
    id: 8,
    name: "Content Violation - Fort",
    position: [18.9333, 72.8333],
    risk: "medium",
    status: "Under Review",
    category: "Content",
  },
];

const RISK_COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

export default function ViolationMapPage() {
  const [reports, setReports] = useState([]);
  const fetchReportDetails = async () => {
    await axios
      .get("http://localhost:8383/report/all")
      .then((res) => {
        setReports(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchReportDetails();
  }, []);

  const center = useMemo(() => {
    if (!reports.length) return [20.5937, 78.9629];
    const lat = r.reduce((s, v) => s + reports.latitude, 0) / reports.length;
    const lng = r.reduce((s, v) => s + reports.longitude, 0) / reports.length;
    return [lat, lng];
  }, []);

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
                    // color: RISK_COLORS[v.status],
                    // fillColor: RISK_COLORS[v.risk],
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
