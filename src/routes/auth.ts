import express from "express";
import bcrypt from "bcryptjs";
import { supabase } from '../lib/supabaseServer';
import { signToken } from "../utils/jwt";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ username, email, password: hashed, role: role || "user" }])
    .select("*")
    .single();

  if (error) return res.status(400).json(error);
  
  const token = signToken({ id: data.id, role: data.role });
  res.json({ user: data, token });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!data || error) return res.status(400).json({ message: "User not found" });

  const isValid = await bcrypt.compare(password, data.password);
  if (!isValid) return res.status(400).json({ message: "Invalid password" });

  const token = signToken({ id: data.id, role: data.role });
  res.json({ user: data, token });
});

export default router;
