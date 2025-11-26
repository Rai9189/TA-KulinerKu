import express from "express";
import { supabase } from "../lib/supabaseClient";
import { optionalAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/role";

const router = express.Router();

// Get all restaurants (guest allowed)
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from("restaurants").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Add restaurant (ADMIN only)
router.post("/", optionalAuth, requireAdmin(), async (req, res) => {
  try {
    const { name, category, rating, address, image, description, open_hours, price_range } = req.body;

    const { data, error } = await supabase
      .from("restaurants")
      .insert([{ name, category, rating, address, image, description, open_hours, price_range }])
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: "Restoran berhasil ditambahkan", data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Update restaurant (ADMIN only)
router.put("/:id", optionalAuth, requireAdmin(), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, rating, address, image, description, open_hours, price_range } = req.body;

    const { data, error } = await supabase
      .from("restaurants")
      .update({ name, category, rating, address, image, description, open_hours, price_range })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: "Restoran berhasil diupdate", data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Delete restaurant (ADMIN only)
router.delete("/:id", optionalAuth, requireAdmin(), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("restaurants").delete().eq("id", id);
    if (error) throw error;
    res.json({ message: "Restoran berhasil dihapus", data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
