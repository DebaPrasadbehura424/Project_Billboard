import bcrypt from "bcryptjs";
import { supabase } from "../database/db.js";
import { generateToken } from "../middleware/generateToken.js";

export const RegisterAuthority = async (req, res) => {
  try {
    const { email, password, full_name, phone_number } = req.body;

    if (!email || !password || !full_name || !phone_number) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { data: existingUser, error: selectError } = await supabase
      .from("authoritys")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("authoritys")
      .insert([{ email, password: hashedPassword, full_name, phone_number }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Authority registered successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const LoginAuthority = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const { data: user, error } = await supabase
      .from("authoritys")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken({
      id: user.id,
      name: user.full_name,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
