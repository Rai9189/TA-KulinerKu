import { Router } from "express";
import { requireAdmin } from "../middleware/role";
import { optionalAuth } from "../middleware/auth";
import { supabase } from "../lib/supabaseClient";

const router = Router();

// Ambil semua user (admin only)
router.get("/", optionalAuth, requireAdmin(), async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Tambah user baru (admin only)
router.post("/", optionalAuth, requireAdmin(), async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const { data, error } = await supabase.from("users").insert([{ username, email, role }]);
    if (error) throw error;
    res.json({ message: "User berhasil ditambahkan", data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
