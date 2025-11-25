import express from "express";
import { supabase } from "../lib/supabaseClient";
import { optionalAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/role";

const router = express.Router();

// Get all restaurants (guest allowed)
router.get("/", optionalAuth, async (req, res) => {
  const { data, error } = await supabase.from("restaurants").select("*");
  if (error) return res.status(400).json(error);
  res.json(data);
});

// Add restaurant (ADMIN only)
router.post("/", optionalAuth, requireAdmin(), async (req, res) => {
  const { name, category, rating, address, image, description, open_hours, price_range } = req.body;

  const { data, error } = await supabase
    .from("restaurants")
    .insert([{ name, category, rating, address, image, description, open_hours, price_range }])
    .select("*")
    .single();

  if (error) return res.status(400).json(error);
  res.json(data);
});

export default router;
