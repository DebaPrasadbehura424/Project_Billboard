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

  const token = generateToken({
    id: data.id,
    name: data.full_name,
  });

  return { message: "Register succesfully", token: token };
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

  return { message: "Login succesfully", token: token };
};

export const getAllCitizens = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("citizens")
      .select("id, full_name, email, phone_number")
      .order("id", { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getCitizenById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("citizens")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
