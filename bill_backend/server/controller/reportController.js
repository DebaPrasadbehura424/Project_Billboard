import { supabase } from "../database/db.js";

export const createReport = async (req, res) => {
  try {
    const { title, issue, address, status } = req.body;

    if (!title || !issue || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          title,
          issue,
          address,
          status: status || "pending",
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

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: "Report not found" });
  }
};
