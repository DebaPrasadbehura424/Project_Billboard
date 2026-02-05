import bcrypt from "bcryptjs";
import { supabase } from "../database/db.js";
import { generateToken } from "../middleware/generateToken.js";

export const RegisterCitizen = async (req, res) => {
  const { full_name, email, phone_number, password } = req.body;

  const { data: existingUser } = await supabase
    .from("citizens")
    .select("*")
    .eq("email", email)
    .single();

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("citizens")
    .insert([
      {
        full_name,
        email,
        phone_number,
        password: hashedPassword,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return res.status(201).json({ message: "Register succesfully" });
};

export const LoginCitizen = async (req, res) => {
  const { email, password } = req.body;
  const { data: user, error } = await supabase
    .from("citizens")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid password");
  }

  const token = generateToken({
    id: user.id,
    name: user.full_name,
  });

  return res.status(200).json({ message: "Login succesfully", token: token });
};

export const getAllCitizens = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("citizens")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getCitizenAndById = async (req, res) => {
  const id = req.user?.id;

  try {
    const { data: user, error: err } = await supabase
      .from("citizens")
      .select("*")
      .eq("id", id)
      .single();

    const { data: reports, error: rerr } = await supabase
      .from("reports")
      .select("*")
      .eq("citizen_id", id);

    let pending = 0;
    let approved = 0;
    let rejected = 0;

    reports.forEach((report) => {
      if (report.status === "pending") pending++;
      else if (report.status === "approved") approved++;
      else if (report.status === "rejected") rejected++;
    });

    if (err) throw err;
    if (rerr) throw rerr;

    return res.status(200).json({
      citizen: user,
      reports: reports,
      counts: {
        pending,
        rejected,
        approved,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
