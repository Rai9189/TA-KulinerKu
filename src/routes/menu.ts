import { Router } from "express";
import { checkRole } from "../middleware/role";
import { supabase } from "../lib/supabaseClient"; // pastikan ada file ini

const router = Router();

// Get all menus
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("menus").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Route admin untuk tambah menu
router.post("/", checkRole(["admin"]), async (req, res) => {
  try {
    const { name, category, price, restaurant_id, image } = req.body;
    const { data, error } = await supabase.from("menus").insert([
      { name, category, price, restaurant_id, image }
    ]);
    if (error) throw error;
    res.json({ message: "Menu berhasil ditambahkan", data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
