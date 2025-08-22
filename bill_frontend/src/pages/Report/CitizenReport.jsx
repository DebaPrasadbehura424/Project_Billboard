import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function CitizenReport({ open, onOpenChange }) {
  const citizenId = sessionStorage.getItem("citizenId");
  const { setReports, setTotalReports, setPendingReports } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    coordinates: { lat: "", lng: "" },
    category: "", // Added to fix undefined 'category' in handleSubmit
  });
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { title, description, location, coordinates, category } = formData;

    if (!title || !description || !location || !category) {
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
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("latitude", coordinates.lat);
      formData.append("longitude", coordinates.lng);
      files.forEach((file) => {
        formData.append("photo", file);
      });

      const aiResponse = await axios.post(
        "http://localhost:8383/ai/analysis",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      let aiData = aiResponse.data;

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

      await axios.post("http://localhost:8383/report/send_report", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTotalReports((prev) => prev + 1);
      setPendingReports((prev) => prev + 1);
      setReports((prev) => [...prev, plainReport]);

      setTimeout(() => {
        setSuccess(false);
        setFormData({
          title: "",
          description: "",
          category: "",
          location: "",
          coordinates: { lat: "", lng: "" },
        });
        setFiles([]);
        onOpenChange(false); // Close modal after success
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
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 ${
          open ? "block" : "hidden"
        }`}
      >
        <div className="bg-[#0A0A0A]/90 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full border border-[#2D2D2D] animate-success">
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-900/30 mb-4">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
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
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 ${
        open ? "block" : "hidden"
      }`}
    >
      <style>
        {`
          .animate-success {
            animation: fadeInScale 0.5s ease-out;
          }
          .animate-modal {
            animation: slideIn 0.4s ease-out;
          }
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .input-focus {
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }
          .input-focus:focus {
            border-color: #3B82F6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
          }
          .button-hover {
            transition: transform 0.2s ease, background-color 0.3s ease, box-shadow 0.3s ease;
          }
          .button-hover:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }
          .button-hover:active {
            transform: scale(0.95);
          }
          .file-hover {
            transition: transform 0.3s ease;
          }
          .file-hover:hover {
            transform: scale(1.02);
          }
          .file-remove {
            transition: background-color 0.2s ease;
          }
          .file-remove:hover {
            background-color: #EF4444;
          }
          @media (max-width: 640px) {
            .coordinates-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
      <div className="bg-[#0A0A0A]/90 backdrop-blur-md rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-[#2D2D2D] animate-modal">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-100 tracking-tight">
          Report Billboard Violation
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Help keep your city compliant by reporting unauthorized or
          non-compliant billboards.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-400 p-4 rounded-lg flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Report Title <span className="text-red-400">*</span>
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of the violation"
              required
              disabled={isLoading}
              className="w-full p-3 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-gray-100 placeholder-gray-500 input-focus"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-3 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-gray-100 input-focus"
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Unauthorized Billboard">
                Unauthorized Billboard
              </option>
              <option value="Non-Compliant Content">
                Non-Compliant Content
              </option>
              <option value="Structural Issue">Structural Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Upload Images/Videos <span className="text-red-400">*</span>
            </label>
            <div className="border-2 border-dashed border-[#2D2D2D] rounded-lg p-6 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V8m0 0L3 12m4-4l4 4m6 0v6m0-6l-4-4m4 4l4 4"
                />
              </svg>
              <label htmlFor="file-upload" className="cursor-pointer mt-2">
                <span className="text-sm text-blue-400 hover:text-blue-300">
                  Click to upload
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
            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="file-hover relative bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg p-2"
                  >
                    <div className="aspect-video bg-gray-800/50 rounded flex items-center justify-center relative">
                      {file.type.startsWith("image/") ? (
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 9a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9zm6 2a2 2 0 100 4 2 2 0 000-4zm8 6l-3-3-3 3"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="file-remove absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
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
              Address <span className="text-red-400">*</span>
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter address"
              required
              disabled={isLoading}
              className="w-full p-3 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-gray-100 input-focus"
            />
          </div>

          {/* Coordinates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-200">
                Latitude & Longitude <span className="text-red-400">*</span>
              </label>
              <button
                type="button"
                onClick={handleLocationDetect}
                disabled={isLoading}
                className="button-hover text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300"
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                Auto Detect
              </button>
            </div>
            <div className="coordinates-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Latitude"
                value={formData.coordinates.lat}
                disabled
                className="w-full p-3 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg text-gray-100"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={formData.coordinates.lng}
                disabled
                className="w-full p-3 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Detailed Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information..."
              rows="4"
              required
              disabled={isLoading}
              className="w-full p-3 bg-[#0A0A0A]/80 border border-[#2D2D2D] rounded-lg text-gray-100 input-focus"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="button-hover px-4 py-2 text-sm text-gray-300 border border-[#2D2D2D] rounded-md hover:text-white hover:bg-gray-800/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="button-hover px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md border border-blue-500/50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 12a8 8 0 1116 0 8 8 0 01-16 0zm8-4v4m0 4h.01"
                    />
                  </svg>
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
