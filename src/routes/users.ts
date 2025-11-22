import { Router } from "express";
import { checkRole } from "../middleware/role";
import { supabase } from "../lib/supabaseClient";

const router = Router();

// Ambil semua user (hanya admin)
router.get("/", checkRole(["admin"]), async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Tambah user baru (admin)
router.post("/", checkRole(["admin"]), async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const { data, error } = await supabase.from("users").insert([{ name, email, role }]);
    if (error) throw error;
    res.json({ message: "User berhasil ditambahkan", data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
