import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Profile() {
  const deafult =
    "data:image/jpeg;base64,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";

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null);
  const citizenId = sessionStorage.getItem("citizenId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.post("http://localhost:8383/citizen/getById", {
          citizenId: citizenId,
        });
        const userData = {
          ...res.data,
          photo: res.data?.photo || deafult,
        };
        setUser(userData);
        setFormData(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    if (citizenId) fetchUser();
  }, [citizenId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // When file selected
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

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("citizenId", citizenId);
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phoneNumber", formData.phoneNumber);

      if (fileInputRef.current?.files[0]) {
        form.append("profile", fileInputRef.current.files[0]);
      }
      const res = await axios.patch(
        "http://localhost:8383/citizen/updateprofile",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUser(res.data);
      setFormData(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
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
            alt={formData?.name}
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
                name="name"
                value={formData?.name || ""}
                onChange={handleChange}
                className="mt-4 text-2xl font-bold text-gray-800 border rounded px-2"
              />
              <p className="text-gray-500">{formData?.role}</p>
            </>
          ) : (
            <>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">
                {user?.name}
              </h2>
              <p className="text-gray-500">{user?.role}</p>
            </>
          )}
        </div>

        {/* Other fields */}
        <div className="mt-6 space-y-4">
          {/* Email */}
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

          {/* Phone */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Phone:</span>
            {editMode ? (
              <input
                type="text"
                name="phoneNumber"
                value={formData?.phoneNumber || ""}
                onChange={handleChange}
                className="border rounded px-2 text-gray-900"
              />
            ) : (
              <span className="text-gray-900">{user?.phoneNumber}</span>
            )}
          </div>

          {/* Points */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Points:</span>
            <span className="text-gray-900">{user?.points}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Joined:</span>
            <span className="text-gray-900">
              {user?.created_at?.split("T")[0]}
            </span>
          </div>
        </div>

        {editMode ? (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
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
