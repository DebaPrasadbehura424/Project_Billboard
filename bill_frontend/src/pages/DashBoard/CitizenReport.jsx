import {
  Calendar,
  Camera,
  Check,
  Loader2,
  MapPin,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../middleware/AuthController";

function CitizenReport({ open, onOpenChange }) {
  const citizenId = sessionStorage.getItem("citizenId");
  const { setReports, setTotalReports, setPendingReports } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    coordinates: { lat: "", lng: "" },
  });
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { title, description, category, location, coordinates } = formData;

    if (!title || !description || !category || !location) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (!coordinates.lat || !coordinates.lng) {
      setError("Please detect your current location (Latitude & Longitude).");
      setIsLoading(false);
      return;
    }

    if (files.length === 0) {
      setError("Please upload at least one image or video.");
      setIsLoading(false);
      return;
    }

    try {
      const convertToBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      const base64Images = await Promise.all(files.map(convertToBase64));

      const aiPayload = {
        description,
        location,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        images: base64Images,
      };

      const aiResponse = await axios.post(
        "http://localhost:8383/ai/analysis",
        aiPayload
      );

      let aiData = aiResponse.data;
      if (aiData.raw) {
        try {
          const cleaned = aiData.raw.replace(/```json|```/g, "").trim();
          aiData = JSON.parse(cleaned);
        } catch (err) {
          console.error("Failed to parse AI JSON:", err);
          setError("AI response could not be understood.");
          setIsLoading(false);
          return;
        }
      }
      console.log(aiData);

      const payload = new FormData();
      payload.append("citizenId", citizenId);
      payload.append("title", title);
      payload.append("description", description);
      payload.append("category", category);
      payload.append("location", location);
      payload.append("date", new Date().toISOString().split("T")[0]);
      payload.append("latitude", coordinates.lat);
      payload.append("longitude", coordinates.lng);
      payload.append("status", "pending");
      payload.append("risk_percentage", aiData.risk_percentage || 0);
      payload.append("risk_level", aiData.risk_level || "Unknown");
      payload.append("risk_reason", aiData.reason || "No reason provided");

      files.forEach((file) => {
        payload.append("photo", file);
      });

      const plainReport = {
        citizenId,
        title,
        description,
        category,
        location,
        date: new Date().toISOString().split("T")[0],
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        status: "pending",
        risk_percentage: aiData.risk_percentage || 0,
        risk_level: aiData.risk_level || "Unknown",
        risk_reason: aiData.reason || "Not provided",
      };

      console.log(plainReport);

      await axios.post("http://localhost:8383/report/send_report", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Update UI state
      setSuccess(true);
      // setTotalReports((prev) => prev + 1);
      // setPendingReports((prev) => prev + 1);
      // setReports((prev) => [...prev, plainReport]);

      setTimeout(() => {
        setSuccess(false);
        // setFormData({
        //   title: "",
        //   description: "",
        //   category: "",
        //   location: "",
        //   coordinates: { lat: "", lng: "" },
        // });
        // setFiles([]);
      }, 1500);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => {
      return (
        (f.type.startsWith("image/") || f.type.startsWith("video/")) &&
        f.size <= 10 * 1024 * 1024
      );
    });
    setFiles((prev) => [...prev, ...valid].slice(0, 5));
  };

  const removeFile = (i) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleLocationDetect = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setFormData((prev) => ({
          ...prev,
          coordinates: { lat, lng },
        }));
      },
      (err) => {
        console.error("Location error:", err);
        setError("Unable to detect location. Please enter manually.");
      }
    );
  };

  const handleChange = (e) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  if (success) {
    return (
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 ${
          open ? "block" : "hidden"
        }`}
      >
        <div className="bg-[#0A0A0A]/90 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md w-full border border-[#2D2D2D]">
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-900/30 mb-4">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-100 mb-2">
              Report Submitted Successfully!
            </h3>
            <p className="text-sm text-gray-400">
              Your violation report has been submitted and will be reviewed by
              authorities.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="bg-[#0A0A0A]/90 backdrop-blur-md rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-[#2D2D2D]">
        <h2 className="text-2xl font-bold text-gray-100">
          Report Billboard Violation
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Help keep your city compliant by reporting unauthorized or
          non-compliant billboards.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-400 p-4 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Report Title *
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of the violation"
              required
              disabled={isLoading}
              className="w-full p-2 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-gray-100 placeholder-gray-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Violation Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-2 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-gray-100"
            >
              <option value="">Select violation type</option>
              <option value="size">Size Violation</option>
              <option value="placement">Placement Violation</option>
              <option value="content">Content Violation</option>
              <option value="hazard">Safety Hazard</option>
            </select>
          </div>

          {/* Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Upload Images/Videos *
            </label>
            <div className="border-2 border-dashed border-[#2D2D2D] rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <label htmlFor="file-upload" className="cursor-pointer mt-2">
                <span className="text-sm text-blue-400">Click to upload</span>
                <span className="block text-xs text-gray-400">
                  PNG, JPG, MP4 up to 10MB (max 5 files)
                </span>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="hidden"
              />
            </div>
            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg p-2"
                  >
                    <div className="aspect-video bg-gray-800/50 rounded flex items-center justify-center relative">
                      {file.type.startsWith("image/") ? (
                        <Camera className="h-8 w-8 text-gray-400" />
                      ) : (
                        <Video className="h-8 w-8 text-gray-400" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-400 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Address *
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter address"
              required
              disabled={isLoading}
              className="w-full p-2 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-gray-100"
            />
          </div>

          {/* Coordinates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-200">
                Latitude & Longitude *
              </label>
              <button
                type="button"
                onClick={handleLocationDetect}
                className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300"
              >
                <MapPin className="h-4 w-4" />
                Auto Detect
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Latitude"
                value={formData.coordinates.lat}
                disabled
                className="w-full p-2 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg text-gray-100"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={formData.coordinates.lng}
                disabled
                className="w-full p-2 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg text-gray-100"
              />
            </div>
          </div>

          {/* Timestamp */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Timestamp
            </label>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toISOString().split("T")[0]}</span>
              <span className="text-xs">(Auto-filled)</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Detailed Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information..."
              rows="4"
              required
              disabled={isLoading}
              className="w-full p-2 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-gray-100"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-gray-300 border border-[#2D2D2D] rounded-md hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md border border-blue-500/50 flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CitizenReport;
