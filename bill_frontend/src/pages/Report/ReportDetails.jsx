import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Clock,
  MapPin,
  Tag,
  Images as ImagesIcon,
  Info,
} from "lucide-react";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

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
  const [reportsDetails, setReportsDetails] = useState([]);
  const statusMeta = useMemo(() => getStatusMeta(reportsDetails.status), []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportId = sessionStorage.getItem("reportId");

        if (!reportId) {
          console.warn("No citizenId found in sessionStorage.");
          return;
        }

        const response = await axios.get(
          `http://localhost:8383/report/reportDetails/${reportId}`
        );
        setReportsDetails(response.data);
      } catch (error) {
        console.error("Error fetching citizen reports:", error);
      }
    };

    fetchReports();
  }, []);

  console.log(reportsDetails);

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
            {reportsDetails.title}
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Violation Report #{reportsDetails.id}
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
                {reportsDetails?.photos?.map((photo, i) => (
                  <figure
                    key={photo.id || i}
                    className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20"
                  >
                    <img
                      src={`http://localhost:8383/${photo.path.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={`Evidence ${i + 1}`}
                      className="h-36 sm:h-44 md:h-48 w-full object-cover"
                      loading="lazy"
                    />
                  </figure>
                ))}
              </div>
            </section>

            {/* Description */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
              <header className="flex items-center gap-2 mb-3">
                <Info className="opacity-80" size={18} />
                <h2 className="text-lg font-medium">description</h2>
              </header>
              <p className="text-sm leading-6 text-white/80">
                {reportsDetails.description}
              </p>
            </section>
          </div>

          {/* Right: Status, Report Details, Category, Small Map */}
          <aside className="space-y-6">
            {/* Status */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
              <h3 className="text-base font-medium mb-3">Status</h3>
              <StatusPill meta={statusMeta} />
            </section>

            {/* Report Details */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
              <h3 className="text-base font-medium mb-4">Report Details</h3>

              <div className="space-y-3 text-sm">
                <DetailRow
                  icon={<User size={16} />}
                  label="Reported by"
                  value="John Doe"
                />
                <DetailRow
                  icon={<Clock size={16} />}
                  label="Date Reported"
                  value={reportsDetails.date?.split("T")[0]}
                />
                <DetailRow
                  icon={<MapPin size={16} />}
                  label="Location"
                  value={reportsDetails.location}
                />

                <DetailRow
                  icon={<MapPin size={16} />}
                  label="Coordinates"
                  value={
                    reportsDetails.latitude && reportsDetails.longitude
                      ? `${reportsDetails.latitude}, ${reportsDetails.longitude}`
                      : "Not available"
                  }
                />
              </div>
            </section>

            {/* Category */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
              <h3 className="text-base font-medium mb-3">Category</h3>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs border border-white/10 bg-white/5">
                <Tag size={14} />
                <span>{reportsDetails.category}</span>
              </div>
            </section>
            {/* Small Map */}
          </aside>
        </div>
        {/* map and ai  */}
        <div className="flex w-full gap-4 mt-4">
          {/* Location Map - half width */}
          <section className="w-1/2 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
            <h3 className="text-base font-medium mb-3">Location Map</h3>

            {reportsDetails.latitude && reportsDetails.longitude ? (
              <div className="overflow-hidden rounded-xl border border-white/10">
                <MapContainer
                  center={[
                    parseFloat(reportsDetails.latitude),
                    parseFloat(reportsDetails.longitude),
                  ]}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-56 w-full"
                  attributionControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <CircleMarker
                    center={[
                      parseFloat(reportsDetails.latitude),
                      parseFloat(reportsDetails.longitude),
                    ]}
                    radius={8}
                  >
                    <Popup>
                      <div className="text-sm">
                        <div className="font-medium mb-1">
                          {reportsDetails.locationText || "Reported Location"}
                        </div>
                        <div className="text-xs opacity-80">
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
              <p className="text-sm text-red-500">
                Location data not available
              </p>
            )}
          </section>

          {/* AI Analysis - half width */}
          <section className="w-1/2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <h3 className="text-base font-medium mb-4">AI Analysis</h3>
            <div className="space-y-4 text-sm">
              {/* Confidence Score */}
              <div>
                <div className="flex justify-between mb-1 text-xs text-white/60">
                  <span>Confidence Score</span>
                  <span>{reportsDetails.risk_percentage || 0}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`
            h-2 rounded-full 
            ${reportsDetails.risk_level === "High" ? "bg-red-500" : ""}
            ${reportsDetails.risk_level === "Medium" ? "bg-yellow-400" : ""}
            ${reportsDetails.risk_level === "Low" ? "bg-green-400" : ""}
            ${!reportsDetails.risk_level ? "bg-gray-400" : ""}
          `}
                    style={{ width: `${reportsDetails.risk_percentage || 0}%` }}
                  />
                </div>
              </div>

              {/* Risk Level */}
              <div className="flex items-center gap-2">
                <span className="text-white/60">Risk Level:</span>
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
                <span className="text-white/60">Detected Violations:</span>
                <p className="text-white/80 mt-1">
                  {reportsDetails.risk_reason || "No violations detected."}
                </p>
              </div>
            </div>
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
