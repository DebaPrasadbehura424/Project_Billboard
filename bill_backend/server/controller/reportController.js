import { reportModel } from "../model/reportModel.js";
import { photoModel } from "../model/photoModel.js";

export const createReportWithPhotos = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const { citizenId, title, category, location, description, date } =
      req.body;

    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one photo is required." });
    }

    // Validate required fields presence
    if (!citizenId || !title || !category || !location || !date) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Convert citizenId to number
    const citizenIdNum = Number(citizenId);
    if (isNaN(citizenIdNum)) {
      return res
        .status(400)
        .json({ message: "citizenId must be a valid number." });
    }

    // Optional: Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Expected YYYY-MM-DD." });
    }

    const reportId = await reportModel.create({
      citizenId: citizenIdNum,
      title,
      category,
      description,
      location,
      date,
    });

    await photoModel.addMultiple(reportId, files);

    res.status(201).json({ message: "Report created successfully", reportId });
  } catch (err) {
    console.error("Error in createReportWithPhotos:", err);
    res.status(500).json({ error: err.message });
  }
};
