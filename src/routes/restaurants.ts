import express from "express";
import { supabase } from "../lib/supabaseClient";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();

// Get all restaurants
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("restaurants").select("*");
  if (error) return res.status(400).json(error);
  res.json(data);
});

// Add restaurant (Admin only)
router.post("/", authenticate, authorize(["admin"]), async (req, res) => {
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
