import { Calendar, Camera, Check, Loader2, MapPin, Upload, Video, X } from "lucide-react";
import { useState } from "react";

function CitizenReport({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
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

    if (!formData.title || !formData.description || !formData.location) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (files.length === 0) {
      setError("Please upload at least one image or video");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to submit a report");
        setIsLoading(false);
        return;
      }

      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("description", formData.description);
      formPayload.append("location", formData.location);
      formPayload.append("date", new Date().toISOString().split("T")[0]);

      // Add coordinates if available
      if (formData.coordinates.lat && formData.coordinates.lng) {
        formPayload.append("latitude", formData.coordinates.lat.toString());
        formPayload.append("longitude", formData.coordinates.lng.toString());
      }

      files.forEach((file) => {
        formPayload.append("photo", file); // match backend multer.array('photo')
      });

      // Log data to console
      console.log("Form Data:", formData);
      console.log("Files:", files);

      const res = await fetch("http://localhost:2000/api/citizen-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // DO NOT set Content-Type here!
        },
        body: formPayload,
      });

      const data = await res.json();
      console.log(data);
    
      if (!data.status) {
        setError(data.message || "Failed to submit report");
        setIsLoading(false);
        return;
      }

      // Success
      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
        setFormData({
          title: "",
          description: "",
          location: "",
          coordinates: { lat: 0, lng: 0 },
        });
        setFiles([]);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return (isImage || isVideo) && isValidSize;
    });

    setFiles((prev) => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            coordinates: { lat: latitude, lng: longitude },
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to detect location. Please enter manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (success) {
    return (
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 ${open ? "block" : "hidden"
          }`}
      >
        <div className="bg-[#0A0A0A]/90 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md w-full border border-[#2D2D2D]">
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-900/30 mb-4">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-100 mb-2">Report Submitted Successfully!</h3>
            <p className="text-sm text-gray-400">
              Your violation report has been submitted and will be reviewed by authorities.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 ${open ? "block" : "hidden"
        }`}
    >
      <div className="bg-[#0A0A0A]/90 backdrop-blur-md rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-[#2D2D2D]">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">Report Billboard Violation</h2>
          <p className="text-sm text-gray-400">
            Help keep your city compliant by reporting unauthorized or non-compliant billboards.
            Our AI will automatically analyze the images to determine the violation category.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-400 p-4 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-200">
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

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Upload Images/Videos *</label>
            <div className="border-2 border-dashed border-[#2D2D2D] rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-blue-400 hover:text-blue-300">
                    Click to upload files
                  </span>
                  <span className="mt-1 block text-xs text-gray-400">
                    PNG, JPG, MP4 up to 10MB (max 5 files)
                  </span>
                  <span className="mt-1 block text-xs text-blue-300">
                    AI will analyze images to detect violations
                  </span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {files.map((file, index) => (
                  <div
                    key={index}
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
                        className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
                        onClick={() => removeFile(index)}
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-gray-200">
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
                type="button"
                onClick={handleLocationDetect}
                disabled={isLoading}
                className="p-2 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                <MapPin className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Timestamp */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Timestamp</label>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleString()}</span>
              <span className="text-xs">(Auto-filled)</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-200">
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide detailed information about the violation, including specific concerns and observations..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              disabled={isLoading}
              className="w-full p-2 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-gray-100 bg-[#0A0A0A]/80 hover:bg-[#0A0A0A] rounded-md transition-colors duration-200 border border-[#2D2D2D]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors duration-200 border border-blue-500/50 flex items-center"
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