import React from "react";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-9xl font-extrabold text-gray-600">404</h1>
      <p className="text-2xl mt-4 text-gray-300">Oops! Page Not Found</p>
      <p className="text-gray-400 mt-2 max-w-md text-center">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition duration-300"
      >
        Go Home
      </button>
    </div>
  );
}

export default PageNotFound;
