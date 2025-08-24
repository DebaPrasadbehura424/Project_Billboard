import "leaflet/dist/leaflet.css";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Gauge,
  Images as ImagesIcon,
  Info,
  Loader2,
  MapPin,
  Ruler,
  Shield,
  Tag,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import { UseRollBased } from "../../middleware/RollBasedAccessController";

// Base URL for the API
const API_URL = "http://localhost:2000";

// Validate latitude and longitude
const isValidCoordinate = (lat, lon) => {
  const isValidLat = typeof lat === "number" && !isNaN(lat) && lat >= -90 && lat <= 90;
  const isValidLon = typeof lon === "number" && !isNaN(lon) && lon >= -180 && lon <= 180;
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

// Risk level configuration
const riskConfig = {
  high: {
    color: "red",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/40",
    textColor: "text-red-400",
    icon: AlertCircle,
    label: "High Risk"
  },
  medium: {
    color: "yellow",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/40",
    textColor: "text-yellow-400",
    icon: AlertTriangle,
    label: "Medium Risk"
  },
  low: {
    color: "green",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/40",
    textColor: "text-green-400",
    icon: CheckCircle,
    label: "Low Risk"
  },
  unknown: {
    color: "gray",
    bgColor: "bg-gray-500/20",
    borderColor: "border-gray-500/40",
    textColor: "text-gray-400",
    icon: Gauge,
    label: "Unknown Risk"
  }
};

// Risk visualization component
const RiskVisualization = ({ percentage, level }) => {
  const riskLevel = level?.toLowerCase() || "unknown";
  const config = riskConfig[riskLevel] || riskConfig.unknown;
  const Icon = config.icon;

  return (
    <div className="relative">
      {/* Volume-like risk meter */}
      <div className="flex items-end justify-center gap-1 h-16 sm:h-20 mb-3 sm:mb-4">
        {[20, 40, 60, 80, 100].map((threshold) => (
          <div
            key={threshold}
            className={`w-2 sm:w-3 rounded-t-lg transition-all duration-500 ease-out ${
              percentage >= threshold
                ? riskLevel === "high"
                  ? "bg-red-500"
                  : riskLevel === "medium"
                  ? "bg-yellow-500"
                  : riskLevel === "low"
                  ? "bg-green-500"
                  : "bg-gray-500"
                : "bg-white/10"
            }`}
            style={{
              height: `${threshold * 0.5}px`,
              animation: percentage >= threshold 
                ? 'pulse 2s infinite' 
                : 'none'
            }}
          />
        ))}
      </div>

      {/* Current level indicator */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
          <Icon size={16} className={config.textColor} />
          <span className={`text-base sm:text-lg font-bold ${config.textColor}`}>
            {percentage}%
          </span>
        </div>
        <div className={`text-xs sm:text-sm font-semibold ${config.textColor}`}>
          {config.label}
        </div>
      </div>

      {/* Floating indicator */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 -top-1 w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-lg border-2"
        style={{ 
          borderColor: riskLevel === "high" ? "#ef4444" : 
                      riskLevel === "medium" ? "#eab308" : 
                      riskLevel === "low" ? "#22c55e" : "#6b7280",
          bottom: `${percentage * 0.5}px`
        }}
      >
        <div className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full ${
          riskLevel === "high" ? "bg-red-500" :
          riskLevel === "medium" ? "bg-yellow-500" :
          riskLevel === "low" ? "bg-green-500" : "bg-gray-500"
        }`} />
      </div>
    </div>
  );
};

// Risk breakdown component
const RiskBreakdown = ({ risks }) => {
  if (!risks) return null;

  const riskTypes = {
    placement: { icon: MapPin, label: "Placement", color: "blue" },
    content: { icon: Eye, label: "Content", color: "purple" },
    size: { icon: Ruler, label: "Size", color: "orange" },
    structural: { icon: Shield, label: "Structural", color: "red" },
    regulatory: { icon: FileText, label: "Regulatory", color: "yellow" }
  };

  const detectedRisks = [];

  // Simple keyword matching for risk types
  const riskText = risks.toLowerCase();
  if (riskText.includes('placement') || riskText.includes('location') || riskText.includes('obstruct')) {
    detectedRisks.push(riskTypes.placement);
  }
  if (riskText.includes('content') || riskText.includes('obscene') || riskText.includes('political')) {
    detectedRisks.push(riskTypes.content);
  }
  if (riskText.includes('size') || riskText.includes('dimension') || riskText.includes('large')) {
    detectedRisks.push(riskTypes.size);
  }
  if (riskText.includes('structural') || riskText.includes('damage') || riskText.includes('leaning')) {
    detectedRisks.push(riskTypes.structural);
  }
  if (riskText.includes('regulation') || riskText.includes('compliance') || riskText.includes('illegal')) {
    detectedRisks.push(riskTypes.regulatory);
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
      {detectedRisks.map((risk, index) => {
        const Icon = risk.icon;
        return (
          <div
            key={index}
            className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 ${
              risk.color === 'blue' ? 'border-blue-500/30 bg-blue-500/10' :
              risk.color === 'purple' ? 'border-purple-500/30 bg-purple-500/10' :
              risk.color === 'orange' ? 'border-orange-500/30 bg-orange-500/10' :
              risk.color === 'red' ? 'border-red-500/30 bg-red-500/10' :
              'border-yellow-500/30 bg-yellow-500/10'
            } backdrop-blur-sm`}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <Icon size={12} className={
                risk.color === 'blue' ? 'text-blue-400' :
                risk.color === 'purple' ? 'text-purple-400' :
                risk.color === 'orange' ? 'text-orange-400' :
                risk.color === 'red' ? 'text-red-400' :
                'text-yellow-400'
              } />
              <span className={`text-[10px] sm:text-xs font-medium ${
                risk.color === 'blue' ? 'text-blue-300' :
                risk.color === 'purple' ? 'text-purple-300' :
                risk.color === 'orange' ? 'text-orange-300' :
                risk.color === 'red' ? 'text-red-300' :
                'text-yellow-300'
              }`}>
                {risk.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function ReportDetails() {
  const { type } = UseRollBased();
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiError, setAiError] = useState(null);
  const statusMeta = useMemo(() => getStatusMeta(report?.status), [report]);

  // Fetch report details
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = type === "authority" ? localStorage.getItem("authorityToken") : localStorage.getItem("token");
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

          // Use latitude and longitude directly from the database
          let latitude = parseFloat(data.report.latitude);
          let longitude = parseFloat(data.report.longitude);
          let coords = [20.337878, 85.817908]; // Fallback to Bhubaneswar

          if (isValidCoordinate(latitude, longitude)) {
            coords = [latitude, longitude]; // Leaflet expects [lat, lon]
          } else {
            console.warn("Invalid coordinates in database, using fallback");
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

  // Fetch AI analysis
  useEffect(() => {
    const fetchAiAnalysis = async () => {
      if (!reportId) return;

      try {
        setAiLoading(true);
        setAiError(null);
        const token = type === "authority" ? localStorage.getItem("authorityToken") : localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(`${API_URL}/api/ai-analysis/${reportId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setAiAnalysis(null); // No AI analysis available is not an error
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status && data.data) {
          setAiAnalysis(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch AI analysis");
        }
      } catch (err) {
        console.error("AI Analysis Fetch Error:", err);
        setAiError(err.message);
      } finally {
        setAiLoading(false);
      }
    };

    if (reportId) {
      fetchAiAnalysis();
    }
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-sm sm:text-base">Loading report details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center p-4">
        <div className="text-center">
          <span className="text-red-400 text-sm sm:text-base block mb-4">Error: {error}</span>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 px-4 py-2 text-sm"
            >
              <Loader2 className="h-4 w-4" />
              Retry
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 px-4 py-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center p-4">
        <span className="text-red-400 text-sm sm:text-base">No report data available</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-950 text-[#fafafa]">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-3 py-2 text-sm"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:block">Back</span>
          </button>

          <div className="flex-1" />

          <span className="sm:hidden">
            <StatusPill meta={statusMeta} />
          </span>
        </div>

        {/* Title */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
            {report.title}
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Violation Report #{report.reportId}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Evidence and Description */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Evidence Section */}
            <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 md:p-6">
              <header className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <ImagesIcon className="opacity-80" size={16} />
                  <h2 className="text-base sm:text-lg font-medium">Evidence</h2>
                </div>
              </header>
              <p className="text-xs text-white/60 mb-3 sm:mb-4">
                Images and videos submitted with this report
              </p>

              {/* Gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {report.media.length > 0 ? (
                  report.media.map((media, i) => (
                    <figure
                      key={media.mediaId}
                      className="relative overflow-hidden rounded-lg sm:rounded-xl border border-white/10 bg-black/20"
                    >
                      {media.type.startsWith("image") ? (
                        <img
                          src={media.url}
                          alt={`Evidence ${i + 1}`}
                          className="h-28 sm:h-36 md:h-44 w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            console.error(`Failed to load image: ${media.url}`);
                            e.target.outerHTML = `
                              <div className="h-28 sm:h-36 md:h-44 w-full flex items-center justify-center text-white/60 bg-black/30 text-xs">
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

            {/* Description Section */}
            <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 md:p-6">
              <header className="flex items-center gap-2 mb-2 sm:mb-3">
                <Info className="opacity-80" size={16} />
                <h2 className="text-base sm:text-lg font-medium">Description</h2>
              </header>
              <p className="text-sm leading-6 text-white/80">
                {report.description}
              </p>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="space-y-4 sm:space-y-6">
            {/* Status */}
            <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 md:p-6">
              <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">Status</h3>
              <StatusPill meta={statusMeta} />
            </section>

            {/* Report Details */}
            <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 md:p-6">
              <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">Report Details</h3>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <DetailRow
                  icon={<User size={14} />}
                  label="Reported by"
                  value={report.userName}
                />
                <DetailRow
                  icon={<Clock size={14} />}
                  label="Date Reported"
                  value={new Date(report.date).toLocaleString()}
                />
                <DetailRow
                  icon={<MapPin size={14} />}
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

            {/* Category */}
            <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 md:p-6">
              <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">Category</h3>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs border border-white/10 bg-white/5">
                <Tag size={12} />
                <span>{report.category}</span>
              </div>
            </section>
          </aside>
        </div>

        {/* Bottom Sections - Map and AI Analysis */}
        <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6 mt-4 sm:mt-6">
          {/* Map Section */}
          <section className="w-full lg:w-1/2 rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black p-3 sm:p-4 backdrop-blur-sm">
            <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-blue-400" />
              Location Map
            </h3>
            <div className="overflow-hidden rounded-lg sm:rounded-xl border border-white/10">
              {isValidCoordinate(report.latitude, report.longitude) ? (
                <MapContainer
                  center={[report.latitude, report.longitude]}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-48 sm:h-56 md:h-64 w-full"
                  attributionControl={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <CircleMarker
                    center={[report.latitude, report.longitude]}
                    radius={8}
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
                <div className="h-48 sm:h-56 md:h-64 w-full flex items-center justify-center text-white/60 bg-black/30">
                  <p className="text-xs sm:text-sm p-3 sm:p-4 text-center">
                    Map not available: Invalid or missing coordinates
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* AI Analysis Section */}
          <section className="w-full lg:w-1/2 rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black p-4 sm:p-5 md:p-6 backdrop-blur-sm">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
              <Gauge size={18} className="text-purple-400" />
              <span className="hidden sm:inline">AI Risk Analysis</span>
              <span className="sm:hidden">AI Analysis</span>
            </h3>
            
            {aiLoading ? (
              <div className="flex items-center justify-center h-40 sm:h-48">
                <div className="text-center">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto mb-2 sm:mb-3 text-purple-400" />
                  <p className="text-white/60 text-xs sm:text-sm">Analyzing billboard risks...</p>
                </div>
              </div>
            ) : aiError ? (
              <div className="text-center py-6 sm:py-8">
                <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-red-400 text-sm sm:text-base mb-1 sm:mb-2">Analysis Failed</p>
                <p className="text-white/60 text-xs sm:text-sm">{aiError}</p>
              </div>
            ) : !aiAnalysis ? (
              <div className="text-center py-6 sm:py-8">
                <Gauge className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-white/60 text-xs sm:text-sm">No AI analysis available</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Risk Visualization */}
                <div className="bg-black/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10">
                  <RiskVisualization 
                    percentage={aiAnalysis.riskAssessment?.percentage || 0} 
                    level={aiAnalysis.riskAssessment?.level} 
                  />
                </div>

                {/* Risk Breakdown */}
                {aiAnalysis.risks && (
                  <div className="bg-black/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                    <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2 text-white/80">
                      <Shield size={14} className="text-blue-400" />
                      Detected Risks
                    </h4>
                    <RiskBreakdown risks={aiAnalysis.risks} />
                  </div>
                )}

                {/* Risk Details */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-black/30 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10">
                    <div className="text-[10px] sm:text-xs text-white/60 mb-1">Category</div>
                    <div className="font-semibold text-white/90 text-xs sm:text-sm">
                      {aiAnalysis.riskAssessment?.category || "Unknown"}
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10">
                    <div className="text-[10px] sm:text-xs text-white/60 mb-1">Level</div>
                    <div className={`font-semibold text-xs sm:text-sm ${
                      riskConfig[aiAnalysis.riskAssessment?.level?.toLowerCase()]?.textColor || 'text-white'
                    }`}>
                      {aiAnalysis.riskAssessment?.level || "Unknown"}
                    </div>
                  </div>
                </div>

                {/* Extracted Content */}
                {aiAnalysis.extractedContent && (
                  <div className="bg-black/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                    <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2 text-white/80">
                      <Eye size={14} className="text-green-400" />
                      Extracted Text
                    </h4>
                    <div className="bg-black/40 rounded-lg p-2 sm:p-3">
                      <p className="text-xs sm:text-sm text-white/80 font-mono">
                        "{aiAnalysis.extractedContent}"
                      </p>
                    </div>
                  </div>
                )}

                {/* AI Summary */}
                {aiAnalysis.aiSummary && (
                  <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-500/20">
                    <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
                      <Ruler size={14} className="text-purple-400" />
                      AI Summary
                    </h4>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                      {aiAnalysis.aiSummary}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

function StatusPill({ meta }) {
  const Icon = meta.icon;
  return (
    <span className={meta.className}>
      <Icon size={12} className={meta.icon === Loader2 ? "animate-spin" : ""} />
      {meta.label}
    </span>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2 items-start">
      <div className="col-span-1 flex items-center gap-1 sm:gap-2 text-white/70">
        <span className="opacity-80">{icon}</span>
        <span className="text-xs">{label}</span>
      </div>
      <div className="col-span-2 text-white/90 text-xs sm:text-sm">{value}</div>
    </div>
  );
}