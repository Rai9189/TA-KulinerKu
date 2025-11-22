import { Router } from "express";
import { checkRole } from "../middleware/role";
import { supabase } from "../lib/supabaseClient"; // pastikan ada

const router = Router();

// Ambil semua review
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("reviews").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Tambah review (hanya user)
router.post("/", checkRole(["user"]), async (req, res) => {
  try {
    const { menu_id, rating, comment, user_id } = req.body;
    const { data, error } = await supabase.from("reviews").insert([
      { menu_id, rating, comment, user_id }
    ]);
    if (error) throw error;
    res.json({ message: "Review berhasil ditambahkan", data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
