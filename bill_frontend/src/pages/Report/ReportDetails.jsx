import "leaflet/dist/leaflet.css";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Images as ImagesIcon,
  Info,
  Loader2,
  MapPin,
  Tag,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";

// Base URL for the API
const API_URL = "http://localhost:2000";

// Validate latitude and longitude
const isValidCoordinate = (lat, lon) => {
  const isValidLat = typeof lat === "number" && lat >= -90 && lat <= 90;
  const isValidLon = typeof lon === "number" && lon >= -180 && lon <= 180;
  return isValidLat && isValidLon;
};

const getStatusMeta = (status) => {
  const base =
    "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border";
  switch ((status || "").toLowerCase()) {
    case "approved":
      return {
        label: "Approved",
        icon: CheckCircle2,
        className: `${base} border-green-500/30 bg-green-500/10 text-green-400`,
      };
    case "rejected":
      return {
        label: "Rejected",
        icon: XCircle,
        className: `${base} border-red-500/30 bg-red-500/10 text-red-400`,
      };
    default:
      return {
        label: "Pending",
        icon: Loader2,
        className: `${base} border-amber-500/30 bg-amber-500/10 text-amber-300`,
      };
  }
};

export default function ReportDetails() {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const statusMeta = useMemo(() => getStatusMeta(report?.status), [report]);

  // Fetch report details
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        if (!reportId) {
          throw new Error("Invalid report ID");
        }

        const response = await fetch(`${API_URL}/api/report/${reportId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Invalid or expired token");
          }
          if (response.status === 404) {
            throw new Error("Report not found or unauthorized");
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status) {
          console.log("Fetched report:", data.report);

          // Parse coordinates from the location field
          let latitude = null;
          let longitude = null;
          let coords = [20.337878, 85.817908]; // Fallback to Bhubaneswar

          if (data.report.location) {
            const [latStr, lonStr] = data.report.location.split(",").map(str => str.trim());
            latitude = parseFloat(latStr);
            longitude = parseFloat(lonStr);
            if (isValidCoordinate(latitude, longitude)) {
              coords = [latitude, longitude]; // Leaflet expects [lat, lon]
            } else {
              console.warn("Invalid coordinates in location field, using fallback");
            }
          }

          // Prefix media URLs with API_URL if they start with /uploads
          const media = data.report.media.map((item) => ({
            ...item,
            url: item.url.startsWith("/uploads")
              ? `${API_URL}${item.url}`
              : item.url,
          }));

          setReport({
            ...data.report,
            locationText: data.report.location || "Bhubaneswar, Odisha, India",
            coords,
            latitude,
            longitude,
            media,
          });
        } else {
          throw new Error(data.message || "Failed to fetch report");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading report details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center gap-4">
        <span className="text-red-400">Error: {error}</span>
        <div className="flex gap-4">
          <button
            onClick={() => fetchReport()}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <Loader2 className="h-4 w-4" />
            Retry
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center">
        <span className="text-red-400">No report data available</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-3 py-2"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>

          <div className="flex-1" />

          <span className="sm:hidden">
            <StatusPill meta={statusMeta} />
          </span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {report.title}
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Violation Report #{report.reportId}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
              <header className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ImagesIcon className="opacity-80" size={18} />
                  <h2 className="text-lg font-medium">Evidence</h2>
                </div>
              </header>
              <p className="text-xs sm:text-sm text-white/60 mb-4">
                Images and videos submitted with this report
              </p>

              {/* Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {report.media.length > 0 ? (
                  report.media.map((media, i) => (
                    <figure
                      key={media.mediaId}
                      className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20"
                    >
                      {media.type.startsWith("image") ? (
                        <img
                          src={media.url}
                          alt={`Evidence ${i + 1}`}
                          className="h-36 sm:h-44 md:h-48 w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            console.error(`Failed to load image: ${media.url}`);
                            e.target.outerHTML = `
                              <div className="h-36 sm:h-44 md:h-48 w-full flex items-center justify-center text-white/60 bg-black/30">
                                Image not available
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <p className="text-xs text-white/60 p-2">
                          Unsupported media type: {media.type}
                        </p>
                      )}
                    </figure>
                  ))
                ) : (
                  <p className="text-sm text-white/60">No media available</p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
              <header className="flex items-center gap-2 mb-3">
                <Info className="opacity-80" size={18} />
                <h2 className="text-lg font-medium">Description</h2>
              </header>
              <p className="text-sm leading-6 text-white/80">
                {report.description}
              </p>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
              <h3 className="text-base font-medium mb-3">Status</h3>
              <StatusPill meta={statusMeta} />
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
              <h3 className="text-base font-medium mb-4">Report Details</h3>
              <div className="space-y-3 text-sm">
                <DetailRow
                  icon={<User size={16} />}
                  label="Reported by"
                  value={report.userName}
                />
                <DetailRow
                  icon={<Clock size={16} />}
                  label="Date Reported"
                  value={new Date(report.date).toLocaleString()}
                />
                <DetailRow
                  icon={<MapPin size={16} />}
                  label="Location"
                  value={
                    <>
                      {report.locationText}
                      <br />
                      {isValidCoordinate(report.latitude, report.longitude)
                        ? `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`
                        : "Coordinates not available"}
                    </>
                  }
                />
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
              <h3 className="text-base font-medium mb-3">Category</h3>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs border border-white/10 bg-white/5">
                <Tag size={14} />
                <span>{report.category}</span>
              </div>
            </section>
          </aside>
        </div>

        <div className="flex w-full gap-4 mt-4">
          <section className="w-1/2 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
            <h3 className="text-base font-medium mb-3">Location Map</h3>
            <div className="overflow-hidden rounded-xl border border-white/10">
              {isValidCoordinate(report.latitude, report.longitude) ? (
                <MapContainer
                  center={report.coords}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="h-64 w-full"
                  attributionControl={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <CircleMarker
                    center={report.coords}
                    radius={10}
                    color="#ff0000"
                    fillColor="#ff0000"
                    fillOpacity={0.5}
                  >
                    <Popup>
                      <div className="text-sm">
                        <div className="font-medium mb-1">
                          {report.locationText}
                        </div>
                        <div className="text-xs opacity-80">
                          {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                </MapContainer>
              ) : (
                <div className="h-64 w-full flex items-center justify-center text-white/60 bg-black/30">
                  <p className="text-sm p-4">
                    Map not available: Invalid or missing coordinates
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="w-1/2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <h3 className="text-base font-medium mb-4">AI Analysis</h3>
            <p className="text-sm text-white/60">
              AI analysis is not available for this report.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ meta }) {
  const Icon = meta.icon;
  return (
    <span className={meta.className}>
      <Icon size={14} className={meta.icon === Loader2 ? "animate-spin" : ""} />
      {meta.label}
    </span>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="grid grid-cols-3 gap-2 items-start">
      <div className="col-span-1 flex items-center gap-2 text-white/70">
        <span className="opacity-80">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="col-span-2 text-white/90">{value}</div>
    </div>
  );
}