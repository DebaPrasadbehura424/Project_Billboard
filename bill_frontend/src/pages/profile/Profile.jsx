import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Profile() {
  const deafult = "https://i.pravatar.cc/150";

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null);

  const citizen_token = sessionStorage.getItem("citizen_token");
  const authority_token = sessionStorage.getItem("authority_token");
  const authenticated = Boolean(citizen_token || authority_token);

  const fetchUser = async () => {
    let role;
    let token;

    if (authority_token != null) {
      role = "authority";
      token = authority_token;
    } else {
      role = "citizen";
      token = citizen_token;
    }

    if (!token) return alert("token is not here");

    try {
      const res = await fetch("http://localhost:8383/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      const userData = {
        ...data,
        photo: data.photo || deafult,
      };

      setUser(userData);
      setFormData(userData);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    if (authenticated) fetchUser();
  }, [authenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6">
        <div className="flex flex-col items-center">
          <img
            src={formData?.photo}
            alt={formData?.full_name}
            onClick={() => editMode && fileInputRef.current.click()}
            className={`w-28 h-28 rounded-full border-4 border-purple-500 shadow-md object-cover ${
              editMode ? "cursor-pointer hover:opacity-80" : ""
            }`}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFile}
            className="hidden"
          />

          {editMode ? (
            <>
              <input
                type="text"
                name="full_name"
                value={formData?.full_name || ""}
                onChange={handleChange}
                className="mt-4 text-2xl font-bold text-gray-800 border rounded px-2"
              />
              <p className="text-gray-500">{formData?.role}</p>
            </>
          ) : (
            <>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">
                {user?.full_name}
              </h2>
              <p className="text-gray-500">{user?.role}</p>
            </>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Email:</span>
            {editMode ? (
              <input
                type="text"
                name="email"
                value={formData?.email || ""}
                onChange={handleChange}
                className="border rounded px-2 text-gray-900"
              />
            ) : (
              <span className="text-gray-900">{user?.email}</span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Phone:</span>
            {editMode ? (
              <input
                type="text"
                name="phone_number"
                value={formData?.phone_number || ""}
                onChange={handleChange}
                className="border rounded px-2 text-gray-900"
              />
            ) : (
              <span className="text-gray-900">{user?.phone_number}</span>
            )}
          </div>
        </div>

        {editMode ? (
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => alert("Save API not implemented yet")}
              className="w-1/2 bg-green-600 text-white py-2 px-4 rounded-lg shadow hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="w-1/2 bg-gray-400 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg shadow hover:bg-purple-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
