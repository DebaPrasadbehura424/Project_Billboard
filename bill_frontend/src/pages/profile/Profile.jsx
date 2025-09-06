import React from "react";

function Profile() {
  const user = {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+91 9876543210",
    role: "Citizen",
    points: 1200,
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    joined: "2024-06-15",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6">
        <div className="flex flex-col items-center">
          <img
            src={user.photo}
            alt={user.name}
            className="w-28 h-28 rounded-full border-4 border-purple-500 shadow-md object-cover"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.role}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-900">{user.email}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Phone:</span>
            <span className="text-gray-900">{user.phone}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Points:</span>
            <span className="text-purple-600 font-bold">{user.points}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Joined:</span>
            <span className="text-gray-900">{user.joined}</span>
          </div>
        </div>

        <button className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg shadow hover:bg-purple-700 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
