import React, { useState, useEffect } from "react";
import { FaRegComment } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReelCoverage() {
  const { theme } = useAuth();
  const isDark = theme === "dark";
  const [reports, setReports] = useState([]);
  const [openComments, setOpenComments] = useState(null);
  const [newComment, setNewComment] = useState("");
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

  const handleToggleComments = (reportId) => {
    if (openComments === reportId) {
      setOpenComments(null);
    } else {
      setOpenComments(reportId);
    }
  };

  const handleAddComment = async (reportId) => {
    if (!newComment.trim()) return;
    try {
      await axios.post("http://localhost:8383/report/comments_add", {
        reportId,
        comment: newComment,
      });
      setNewComment("");
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                comments: [
                  ...(r.comments || []),
                  { id: Date.now(), comment: newComment },
                ],
              }
            : r
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    getAllReports();
  }, []);

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 md:p-8 ${
        isDark
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-b from-gray-50 to-gray-200 text-gray-900"
      } transition-colors duration-300`}
    >
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`rounded-2xl shadow-xl p-4 sm:p-6 w-full transition-transform duration-300 hover:scale-[1.02] ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex flex-col mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://via.placeholder.com/40"
                  alt="profile"
                  className="w-12 h-12 rounded-full cursor-pointer border-2 border-blue-500"
                  onClick={() => navigate("/citizenprofile")}
                />
                <div>
                  <span className="font-semibold text-lg sm:text-xl tracking-tight">
                    {report.title}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {report.location} • {report.category}
                  </p>
                </div>
              </div>
            </div>

            {report.photos && report.photos.length > 0 ? (
              <ImageSlider
                images={report.photos.map(
                  (p) => `http://localhost:8383/${p.path}`
                )}
              />
            ) : (
              <div className="w-full h-64 sm:h-80 flex items-center justify-center rounded-xl bg-gray-300 dark:bg-gray-700">
                <span className="text-gray-500 dark:text-gray-400">
                  No Image
                </span>
              </div>
            )}

            <div className="flex items-center gap-6 mt-4 text-xl">
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors duration-200"
                onClick={() => handleToggleComments(report.id)}
              >
                <FaRegComment />
                <span className="text-sm">{report.comments?.length || 0}</span>
              </div>
            </div>

            <p className="mt-3 text-sm sm:text-base leading-relaxed">
              {report.description}
            </p>

            {openComments === report.id && (
              <div className="mt-4 border-t border-gray-300 dark:border-gray-600 pt-4">
                <div className="flex flex-col gap-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
                  {report.comments && report.comments.length > 0 ? (
                    report.comments.map((c, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-gray-700 transition-colors duration-200"
                      >
                        <img
                          src="https://via.placeholder.com/30"
                          alt="user"
                          className="w-8 h-8 rounded-full border border-blue-400"
                        />
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          {c.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      No comments yet.
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    onClick={() => handleAddComment(report.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageSlider({ images }) {
  const [index, setIndex] = React.useState(0);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-xl">
      <img
        src={images[index]}
        alt="slide"
        className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-blue-600/70 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600/70 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

export default ReelCoverage;
