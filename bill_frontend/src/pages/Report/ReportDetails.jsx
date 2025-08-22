import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const getStatusMeta = (status) => {
  const base =
    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border";
  switch ((status || "").toLowerCase()) {
    case "approved":
      return {
        label: "Approved",
        className: `${base} border-green-500/30 bg-green-500/10 text-green-400`,
      };
    case "rejected":
      return {
        label: "Rejected",
        className: `${base} border-red-500/30 bg-red-500/10 text-red-400`,
      };
    default:
      return {
        label: "Pending",
        className: `${base} border-amber-500/30 bg-amber-500/10 text-amber-300`,
      };
  }
};

export default function ReportDetails() {
  const navigate = useNavigate();
  const [reportsDetails, setReportsDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Added for better UX
  const statusMeta = useMemo(
    () => getStatusMeta(reportsDetails.status),
    [reportsDetails.status]
  );

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const reportId = sessionStorage.getItem("reportId");
        if (!reportId) {
          console.warn("No reportId found in sessionStorage.");
          return;
        }
        const response = await axios.get(
          `http://localhost:8383/report/reportDetails/${reportId}`
        );
        setReportsDetails(response.data);
      } catch (error) {
        console.error("Error fetching report details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-[#E5E7EB] px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <style>
        {`
          .fade-in {
            opacity: 0;
            transform: translateY(-10px);
            animation: fadeIn 0.5s ease-out forwards;
          }
          @keyframes fadeIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .section-hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .section-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(255, 255, 255, 0.1);
          }
          .button-hover {
            transition: transform 0.2s ease, background-color 0.3s ease, box-shadow 0.3s ease;
          }
          .button-hover:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
          }
          .button-hover:active {
            transform: scale(0.95);
          }
          .image-hover {
            transition: transform 0.3s ease;
          }
          .image-hover:hover {
            transform: scale(1.02);
          }
          .map-container {
            scrollbar-width: none;
          }
          .map-container::-webkit-scrollbar {
            display: none;
          }
          @media (max-width: 1024px) {
            .main-grid {
              grid-template-columns: 1fr;
            }
          }
          @media (max-width: 640px) {
            .map-ai-grid {
              flex-direction: column;
            }
            .map-section, .ai-section {
              width: 100%;
            }
          }
        `}
      </style>

      {/* Header */}
      <div className="fade-in mx-auto max-w-7xl mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="button-hover inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm px-3 py-2"
            aria-label="Go back"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <div className="flex-1" />
          <StatusPill meta={statusMeta} />
        </div>
      </div>

      {/* Title */}
      <div className="fade-in mx-auto max-w-7xl mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          {isLoading ? "Loading..." : reportsDetails.title || "Report Title"}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Violation Report #{reportsDetails.id || "N/A"}
        </p>
      </div>

      {/* Main Content */}
      <div className="main-grid mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Evidence and Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Evidence Section */}
          <section className="section-hover rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <header className="flex items-center gap-2 mb-3">
              <svg
                className="h-5 w-5 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-lg font-medium">Evidence</h2>
            </header>
            <p className="text-sm text-gray-400 mb-4">
              Images and videos submitted with this report
            </p>
            {isLoading ? (
              <div className="text-gray-400 text-center py-4">
                Loading evidence...
              </div>
            ) : reportsDetails?.photos?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {reportsDetails.photos.map((photo, i) => (
                  <figure
                    key={photo.id || i}
                    className="image-hover relative overflow-hidden rounded-xl border border-white/10 bg-black/20"
                  >
                    <img
                      src={`http://localhost:8383/${photo.path.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={`Evidence ${i + 1}`}
                      className="h-36 sm:h-44 w-full object-cover"
                      loading="lazy"
                    />
                  </figure>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No evidence available</p>
            )}
          </section>

          {/* Description Section */}
          <section className="section-hover rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <header className="flex items-center gap-2 mb-3">
              <svg
                className="h-5 w-5 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-lg font-medium">Description</h2>
            </header>
            <p className="text-sm leading-6 text-gray-200">
              {isLoading
                ? "Loading description..."
                : reportsDetails.description || "No description provided"}
            </p>
          </section>
        </div>

        {/* Right: Status, Report Details, Category */}
        <aside className="space-y-6">
          {/* Status */}
          <section className="section-hover rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <h3 className="text-base font-medium mb-3">Status</h3>
            <StatusPill meta={statusMeta} />
          </section>

          {/* Report Details */}
          <section className="section-hover rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <h3 className="text-base font-medium mb-4">Report Details</h3>
            <div className="space-y-3 text-sm">
              <DetailRow
                icon={
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
                label="Reported by"
                value={isLoading ? "Loading..." : "John Doe"}
              />
              <DetailRow
                icon={
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                label="Date Reported"
                value={
                  isLoading
                    ? "Loading..."
                    : reportsDetails.date?.split("T")[0] || "N/A"
                }
              />
              <DetailRow
                icon={
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                }
                label="Location"
                value={
                  isLoading ? "Loading..." : reportsDetails.location || "N/A"
                }
              />
              <DetailRow
                icon={
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                }
                label="Coordinates"
                value={
                  isLoading
                    ? "Loading..."
                    : reportsDetails.latitude && reportsDetails.longitude
                    ? `${reportsDetails.latitude}, ${reportsDetails.longitude}`
                    : "Not available"
                }
              />
            </div>
          </section>

          {/* Category */}
          <section className="section-hover rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <h3 className="text-base font-medium mb-3">Category</h3>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-sm border border-white/10 bg-white/5">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 7h10m0 0v10m0-10l-7 7"
                />
              </svg>
              <span>
                {isLoading ? "Loading..." : reportsDetails.category || "N/A"}
              </span>
            </div>
          </section>
        </aside>
      </div>

      {/* Map and AI Analysis */}
      <div className="map-ai-grid mx-auto max-w-7xl flex flex-col sm:flex-row gap-4 mt-6">
        {/* Location Map */}
        <section className="map-section w-full sm:w-1/2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <h3 className="text-base font-medium mb-3">Location Map</h3>
          {isLoading ? (
            <div className="text-gray-400 text-center py-4">Loading map...</div>
          ) : reportsDetails.latitude && reportsDetails.longitude ? (
            <div className="map-container overflow-hidden rounded-xl border border-white/10">
              <MapContainer
                center={[
                  parseFloat(reportsDetails.latitude),
                  parseFloat(reportsDetails.longitude),
                ]}
                zoom={13}
                scrollWheelZoom={false}
                className="h-64 w-full"
                attributionControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <CircleMarker
                  center={[
                    parseFloat(reportsDetails.latitude),
                    parseFloat(reportsDetails.longitude),
                  ]}
                  radius={8}
                  fillColor="#3B82F6"
                  color="#3B82F6"
                  fillOpacity={0.8}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-medium mb-1">
                        {reportsDetails.locationText || "Reported Location"}
                      </div>
                      <div className="text-xs text-gray-400">
                        <strong>Latitude:</strong> {reportsDetails.latitude}
                        <br />
                        <strong>Longitude:</strong> {reportsDetails.longitude}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              </MapContainer>
            </div>
          ) : (
            <p className="text-sm text-red-400">Location data not available</p>
          )}
        </section>

        {/* AI Analysis */}
        <section className="ai-section w-full sm:w-1/2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <h3 className="text-base font-medium mb-4">AI Analysis</h3>
          {isLoading ? (
            <div className="text-gray-400 text-center py-4">
              Loading AI analysis...
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              {/* Confidence Score */}
              <div>
                <div className="flex justify-between mb-1 text-xs text-gray-400">
                  <span>Confidence Score</span>
                  <span>{reportsDetails.risk_percentage || 0}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`
                      h-2 rounded-full transition-all duration-500
                      ${
                        reportsDetails.risk_level === "High" ? "bg-red-500" : ""
                      }
                      ${
                        reportsDetails.risk_level === "Medium"
                          ? "bg-yellow-400"
                          : ""
                      }
                      ${
                        reportsDetails.risk_level === "Low"
                          ? "bg-green-400"
                          : ""
                      }
                      ${!reportsDetails.risk_level ? "bg-gray-400" : ""}
                    `}
                    style={{ width: `${reportsDetails.risk_percentage || 0}%` }}
                  />
                </div>
              </div>
              {/* Risk Level */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Risk Level:</span>
                <span
                  className={`
                    inline-block px-2 py-0.5 text-xs rounded-full border
                    ${
                      reportsDetails.risk_level === "High"
                        ? "bg-red-500/10 text-red-300 border-red-500/30"
                        : ""
                    }
                    ${
                      reportsDetails.risk_level === "Medium"
                        ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/30"
                        : ""
                    }
                    ${
                      reportsDetails.risk_level === "Low"
                        ? "bg-green-500/10 text-green-300 border-green-500/30"
                        : ""
                    }
                    ${
                      !reportsDetails.risk_level
                        ? "bg-gray-500/10 text-gray-300 border-gray-500/30"
                        : ""
                    }
                  `}
                >
                  {reportsDetails.risk_level || "Unknown"}
                </span>
              </div>
              {/* Detected Violations */}
              <div>
                <span className="text-gray-400">Detected Violations:</span>
                <p className="text-gray-200 mt-1">
                  {reportsDetails.risk_reason || "No violations detected"}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatusPill({ meta }) {
  return (
    <span className={meta.className}>
      <svg
        className={`h-4 w-4 ${meta.label === "Pending" ? "animate-spin" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {meta.label === "Approved" && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        )}
        {meta.label === "Rejected" && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        )}
        {meta.label === "Pending" && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 12a8 8 0 1116 0 8 8 0 01-16 0zm8-4v4m0 4h.01"
          />
        )}
      </svg>
      {meta.label}
    </span>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="grid grid-cols-3 gap-2 items-start">
      <div className="col-span-1 flex items-center gap-2 text-gray-400">
        <span className="opacity-80">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="col-span-2 text-gray-200">{value}</div>
    </div>
  );
}
