import React, { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaThumbsDown,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function ReelCoverage() {
  const { theme } = useAuth();
  const isDark = theme === "dark";

  const reports = [
    {
      id: 1,
      name: "Alice",
      photo: "https://randomuser.me/api/portraits/women/1.jpg",
      images: [
        "https://picsum.photos/400/300?random=1",
        "https://picsum.photos/400/300?random=2",
        "https://picsum.photos/400/300?random=3",
      ],
      caption: "Exploring the new city! 🏙️",
    },
    {
      id: 2,
      name: "Bob",
      photo: "https://randomuser.me/api/portraits/men/2.jpg",
      images: [
        "https://picsum.photos/400/300?random=4",
        "https://picsum.photos/400/300?random=5",
      ],
      caption: "Great day at the beach 🌊",
    },
    {
      id: 3,
      name: "Clara",
      photo: "https://randomuser.me/api/portraits/women/3.jpg",
      images: [
        "https://picsum.photos/400/300?random=6",
        "https://picsum.photos/400/300?random=7",
        "https://picsum.photos/400/300?random=8",
      ],
      caption: "Work hard, chill harder 😎",
    },
  ];

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
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={report.photo}
                alt={report.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">{report.name}</span>
            </div>

            {/* Image slider */}
            <ImageSlider images={report.images} />

            {/* Action icons */}
            <div className="flex items-center gap-6 mt-3 text-xl">
              <FaRegHeart className="cursor-pointer hover:text-red-500 transition" />
              <FaThumbsDown className="cursor-pointer hover:text-blue-500 transition" />
              <FaRegComment className="cursor-pointer hover:text-green-500 transition" />
            </div>

            {/* Caption */}
            <p className="mt-2 text-sm">{report.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Image slider component
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
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
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
