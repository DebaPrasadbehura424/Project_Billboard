import { useState } from "react";
import axios from "axios";

function ReportForm() {
  const token = sessionStorage.getItem("citizen_token");
  const [form, setForm] = useState({
    title: "",
    issue: "",
    address: "",
    lat: "",
    lng: "",
  });

  const [photo, setPhoto] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        });
      },
      () => setMessage("Failed to fetch location"),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const aiData = new FormData();
      // aiData.append("title", form.title);
      // aiData.append("description", form.issue);
      aiData.append("image", photo);

      const aiRespond = await axios.post(
        "http://localhost:5001/image_detect",
        aiData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("issue", form.issue);
      payload.append("address", form.address);
      payload.append("lat", form.lat);
      payload.append("lng", form.lng);
      payload.append("status", "pending");
      payload.append("risk_level", aiRespond.risk.riskLevel);
      payload.append("risk_percentage", aiRespond.risk.riskPercentage);

      payload.append("photo", photo);

      await axios.post("http://localhost:8383/report/create", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Report submitted successfully!");
      setForm({ title: "", issue: "", address: "", lat: "", lng: "" });
      setPhoto();
    } catch (err) {
      setMessage("Error submitting report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-[#0F0F0F] rounded-xl shadow-xl border border-gray-800 text-white">
      <h1 className="text-2xl font-bold mb-4">Submit Violation Report</h1>

      {message && (
        <p className="mb-4 text-center p-2 rounded bg-gray-800 text-blue-300">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 bg-black/40 border border-gray-700 rounded"
            placeholder="Violation title"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Issue / Description *</label>
          <textarea
            name="issue"
            value={form.issue}
            onChange={handleChange}
            className="w-full p-3 bg-black/40 border border-gray-700 rounded"
            placeholder="Describe the violation"
            rows="3"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1">Address *</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-3 bg-black/40 border border-gray-700 rounded"
            placeholder="Location / Address"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Coordinates *</label>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="lat"
              value={form.lat}
              readOnly
              placeholder="Latitude"
              className="p-3 bg-black/40 border border-gray-700 rounded"
            />
            <input
              type="text"
              name="lng"
              value={form.lng}
              readOnly
              placeholder="Longitude"
              className="p-3 bg-black/40 border border-gray-700 rounded"
            />
          </div>

          <button
            type="button"
            onClick={detectLocation}
            className="mt-2 text-sm text-blue-400 hover:underline"
          >
            Auto Detect Location
          </button>
        </div>

        <div>
          <label className="block mb-1">Upload Photos (required)</label>
          <input
            type="file"
            multiple
            onChange={(e) => setPhoto([...e.target.files])}
            accept="image/*"
            className="w-full p-2 bg-black/40 border border-gray-700 rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 transition font-semibold"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

export default ReportForm;
