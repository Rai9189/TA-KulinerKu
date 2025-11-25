import { Router } from "express";
import { supabase } from "../lib/supabaseClient";
import { optionalAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/role";

const router = Router();

// Get all menus (guest allowed)
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from("menu_items").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Add menu (ADMIN only)
router.post("/", optionalAuth, requireAdmin(), async (req, res) => {
  try {
    const { name, category, price, restaurant_id, image } = req.body;
    const { data, error } = await supabase.from("menu_items").insert([
      { name, category, price, restaurant_id, image }
    ]);
    if (error) throw error;
    res.json({ message: "Menu berhasil ditambahkan", data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
