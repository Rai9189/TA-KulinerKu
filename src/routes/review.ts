import { Router } from "express";
import { supabase } from "../lib/supabaseClient";
import { optionalAuth } from "../middleware/auth";
import { requireUser } from "../middleware/role";

const router = Router();

// Ambil semua review (guest allowed)
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from("reviews").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Tambah review (user/admin only)
router.post("/", optionalAuth, requireUser(), async (req, res) => {
  try {
    const { menu_id, rating, comment } = req.body;

    const { data: insertData, error } = await supabase
      .from("reviews")
      .insert([
        { menu_id, rating, comment, user_id: req.user.id }
      ])
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: "Review berhasil ditambahkan", data: insertData });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
