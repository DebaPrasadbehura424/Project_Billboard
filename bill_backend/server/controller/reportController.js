import { supabase } from "../database/db.js";

export const createReport = async (req, res) => {
  const citizen_id = req.user?.id;
  try {
    const {
      title,
      issue,
      address,
      status,
      risk_level,
      risk_percentage,
      lng,
      lat,
    } = req.body;

    if (!title || !issue || !address || !lng || !lat) {
      return res.status(400).json({
        error: "title, issue, address, lng, lat are required fields",
      });
    }

    let photo_url = null;
    if (req.file) {
      const file = req.file;
      const file_name = `reports_${Date.now()}_${file.originalname}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("images")
        .upload(file_name, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });
      if (storageError) throw storageError;
      const { data: publicUrl } = supabase.storage
        .from("images")
        .getPublicUrl(file_name);
      photo_url = publicUrl.publicUrl;
    }

    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          title,
          issue,
          address,
          status: status || "pending",
          risk_level: risk_level || "Low",
          risk_percentage: risk_percentage || "0",
          lng: lng.toString(),
          lat: lat.toString(),
          citizen_id,
          photo: photo_url,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: "Report created successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    let pending = 0;
    let approved = 0;
    let rejected = 0;

    data.forEach((report) => {
      if (report.status === "pending") pending++;
      else if (report.status === "approved") approved++;
      else if (report.status === "rejected") rejected++;
    });

    res.status(200).json({
      reports: data,
      counts: {
        pending,
        approved,
        rejected,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;

    const { data: report, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .single();

    if (error) throw error;

    const { data: citizen, error: rerr } = await supabase
      .from("citizens")
      .select("email, full_name, phone_number")
      .eq("id", report.citizen_id)
      .single();

    if (rerr) throw rerr;

    return res.status(200).json({
      report,
      citizen,
    });
  } catch (err) {
    return res.status(404).json({ error: "Report not found" });
  }
};
export const getByCitizen = async (req, res) => {
  try {
    const { citizenId } = req.params;

    const { data: reports, error } = await supabase
      .from("reports")
      .select("*")
      .eq("citizen_id", citizenId);

    if (error) throw error;

    return res.status(200).json({
      reports,
    });
  } catch (err) {
    return res.status(404).json({ error: "Report not found" });
  }
};
export const updateStatus = async (req, res) => {
  try {
    const { status, reportId } = req.body;

    const { data, error } = await supabase
      .from("reports")
      .update({ status })
      .eq("id", reportId);

    if (error) throw error;

    return res.status(200).json({
      message: "status update successfully",
    });
  } catch (err) {
    return res.status(404).json({ error: "Report not found" });
  }
};
