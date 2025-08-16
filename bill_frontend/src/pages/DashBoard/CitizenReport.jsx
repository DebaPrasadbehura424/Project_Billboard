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

function CitizenReport({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    coordinates: { lat: 0, lng: 0 },
  });
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.location
    ) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (files.length === 0) {
      setError("Please upload at least one image or video");
      setIsLoading(false);
      return;
    }

    const getCurrentLocation = () =>
      new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6),
            });
          },
          (err) => {
            console.error("Geolocation error:", err);
            resolve(null);
          }
        );
      });

    try {
      const coords = await getCurrentLocation();

      const finalLocation = coords
        ? `${formData.location} - ${coords.lat},${coords.lng}`
        : formData.location;

      const payload = new FormData();

      payload.append("citizenId", "1"); // always present
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      payload.append("location", finalLocation);
      payload.append("date", new Date().toISOString().split("T")[0]);

      payload.append(
        "latitude",
        (coords?.lat || formData.coordinates.lat).toString()
      );
      payload.append(
        "longitude",
        (coords?.lng || formData.coordinates.lng).toString()
      );

      files.forEach((file) => {
        payload.append("photo", file);
      });

      // Log FormData entries for debugging
      for (let pair of payload.entries()) {
        console.log(pair[0], ":", pair[1]);
      }

      await axios.post("http://localhost:8383/report/send_report", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
        setFormData({
          title: "",
          description: "",
          category: "",
          location: "",
          coordinates: { lat: 0, lng: 0 },
        });
        setFiles([]);
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
          location: `${prev.location || ""} - ${lat}, ${lng}`,
        }));
      },
      (err) => {
        console.error("Location error:", err);
        setError("Unable to detect location. Please enter manually.");
      }
    );
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">
            Report Billboard Violation
          </h2>
          <p className="text-sm text-gray-400">
            Help keep your city compliant by reporting unauthorized or
            non-compliant billboards.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-400 p-4 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}
          {/* -- Title -- */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-200"
            >
              Report Title *
            </label>
            <input
              id="title"
              name="title"
              placeholder="Brief description of the violation"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-2 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          {/* -- Category -- */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-200"
            >
              Violation Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={handleChange}
              name="category"
              disabled={isLoading}
              className="w-full p-2 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="" disabled>
                Select violation type
              </option>
              <option value="size">Size Violation</option>
              <option value="placement">Placement Violation</option>
              <option value="content">Content Violation</option>
              <option value="hazard">Safety Hazard</option>
            </select>
          </div>
          {/* -- Upload -- */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Upload Images/Videos *
            </label>
            <div className="border-2 border-dashed border-[#2D2D2D] rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="block text-sm font-medium text-blue-400 hover:text-blue-300">
                    Click to upload files
                  </span>
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
                        disabled={isLoading}
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
          {/* -- Location -- */}
          <div className="space-y-2">
            <label
              htmlFor="location"
              className="text-sm font-medium text-gray-200"
            >
              Location *
            </label>
            <div className="flex gap-2">
              <input
                id="location"
                name="location"
                placeholder="Enter address or coordinates"
                value={formData.location}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="flex-1 p-2 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                onClick={handleLocationDetect}
                disabled={isLoading}
                className="p-2 border border-[#2D2D2D] rounded-lg bg-[#0A0A0A]/80 text-blue-400 hover:text-blue-300"
              >
                <MapPin className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* -- Timestamp -- */}
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
          {/* -- Description -- */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-200"
            >
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide detailed information..."
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-2 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            ></textarea>
          </div>
          {/* -- Buttons -- */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-gray-100 bg-[#0A0A0A]/80 rounded-md border border-[#2D2D2D]"
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md border border-blue-500/50 flex items-center"
              type="submit"
              disabled={isLoading}
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
