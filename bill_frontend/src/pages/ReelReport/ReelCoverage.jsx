import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaThumbsDown,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReelCoverage() {
  const { theme } = useAuth();
  const isDark = theme === "dark";
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  const getAllReports = async () => {
    try {
      const response = await axios.get("http://localhost:8383/report/all");
      const data = response.data;
      if (Array.isArray(data)) {
        setReports(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    getAllReports();
  }, []);

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark ? "bg-[#181818] text-[#FAFAFA]" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex flex-col gap-8">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`rounded-2xl shadow-lg p-4 max-w-md mx-auto w-full ${
              isDark ? "bg-[#242424]" : "bg-white"
            }`}
          >
            <div className="flex flex-col mb-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://via.placeholder.com/40"
                  alt="profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={() => navigate("/citizenprofile")}
                />
                <span className="font-bold text-lg">{report.title}</span>
              </div>
              <span className="text-sm text-gray-500">
                {report.location} • {report.category}
              </span>
            </div>

            {report.photos && report.photos.length > 0 ? (
              <ImageSlider
                images={report.photos.map(
                  (p) => `http://localhost:8383/${p.path}`
                )}
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-300 rounded-xl">
                <span>No Image</span>
              </div>
            )}

            <div className="flex items-center gap-6 mt-3 text-xl">
              <FaRegComment className="cursor-pointer hover:text-green-500 transition" />
            </div>

            <p className="mt-2 text-sm">{report.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageSlider({ images }) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-xl">
      <img
        src={images[index]}
        alt="slide"
        className="w-full h-full object-cover transition-all"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-green-500/40 text-white p-2 rounded-full"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

export default ReelCoverage;
