import { Router } from "express";
import { supabase } from '../lib/supabaseServer';
import { optionalAuth } from "../middleware/auth";
import { requireUser } from "../middleware/role";

// Type augmentation untuk req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        role: "user" | "admin";
      };
    }
  }
}

const router = Router();

// ======================================================
// GET REVIEW MENU
// ======================================================
router.get("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("reviews")
      .select("*, users(username, profile_image)")
      .eq("menu_id", id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Format response dengan userName
    const formattedData = data?.map((review: any) => ({
      ...review,
      userName: review.users?.username || "User",
      profile_image: review.users?.profile_image || null,
    }));

    res.json(formattedData);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ======================================================
// GET REVIEW RESTAURANT
// ======================================================
router.get("/restaurant/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("reviews")
      .select("*, users(username, profile_image)")
      .eq("restaurant_id", id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Format response dengan userName
    const formattedData = data?.map((review: any) => ({
      ...review,
      userName: review.users?.username || "User",
      profile_image: review.users?.profile_image || null,
    }));

    res.json(formattedData);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ======================================================
// TAMBAH REVIEW MENU (USER / ADMIN ONLY)
// ======================================================
router.post("/menu", optionalAuth, requireUser(), async (req, res) => {
  try {
    const { menu_id, rating, comment } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          menu_id,
          rating,
          comment,
          user_id: req.user.id,
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    // UPDATE RATING MENU
    await supabase.rpc("update_menu_rating", { menu_id });

    // Ambil username untuk response
    const { data: userData } = await supabase
      .from("users")
      .select("username")
      .eq("id", req.user.id)
      .single();

    const responseData = {
      ...data,
      userName: userData?.username || req.user.username,
    };

    res.json({ message: "Review menu ditambahkan", data: responseData });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ======================================================
// TAMBAH REVIEW RESTAURANT
// ======================================================
router.post("/restaurant", optionalAuth, requireUser(), async (req, res) => {
  try {
    const { restaurant_id, rating, comment } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          restaurant_id,
          rating,
          comment,
          user_id: req.user.id,
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    // UPDATE RATING RESTAURANT
    await supabase.rpc("update_restaurant_rating", { restaurant_id });

    // Ambil username untuk response
    const { data: userData } = await supabase
      .from("users")
      .select("username")
      .eq("id", req.user.id)
      .single();

    const responseData = {
      ...data,
      userName: userData?.username || req.user.username,
    };

    res.json({ message: "Review restoran ditambahkan", data: responseData });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ======================================================
// UPDATE REVIEW (HANYA PEMILIK REVIEW SENDIRI)
// ======================================================
router.put("/:id", optionalAuth, requireUser(), async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Cek kepemilikan review
    const { data: existingReview, error: checkError } = await supabase
      .from("reviews")
      .select("user_id, menu_id, restaurant_id")
      .eq("id", id)
      .single();

    if (checkError || !existingReview) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }

    // ⭐ UBAH: HANYA pemilik yang bisa update
    if (existingReview.user_id !== req.user.id) {
      return res.status(403).json({ message: "Anda hanya bisa mengupdate review milik Anda sendiri" });
    }

    // Update review
    const { data, error } = await supabase
      .from("reviews")
      .update({ rating, comment })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    // Update rating menu/restaurant
    if (existingReview.menu_id) {
      await supabase.rpc("update_menu_rating", {
        menu_id: existingReview.menu_id,
      });
    }

    if (existingReview.restaurant_id) {
      await supabase.rpc("update_restaurant_rating", {
        restaurant_id: existingReview.restaurant_id,
      });
    }

    // Ambil username untuk response
    const { data: userData } = await supabase
      .from("users")
      .select("username")
      .eq("id", req.user.id)
      .single();

    const responseData = {
      ...data,
      userName: userData?.username || req.user.username,
    };

    res.json({ message: "Review berhasil diupdate", data: responseData });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ======================================================
// DELETE REVIEW (HANYA PEMILIK REVIEW SENDIRI)
// Admin TIDAK bisa hapus review user lain
// ======================================================
router.delete("/:id", optionalAuth, requireUser(), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Cek kepemilikan review
    const { data: existingReview, error: checkError } = await supabase
      .from("reviews")
      .select("user_id, menu_id, restaurant_id")
      .eq("id", id)
      .single();

    if (checkError || !existingReview) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }

    // ⭐ UBAH: HANYA pemilik yang bisa hapus (admin juga tidak bisa)
    if (existingReview.user_id !== req.user.id) {
      return res.status(403).json({ message: "Anda hanya bisa menghapus review milik Anda sendiri" });
    }

    // Hapus review
    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) throw error;

    // Update rating menu/restaurant
    if (existingReview.menu_id) {
      await supabase.rpc("update_menu_rating", {
        menu_id: existingReview.menu_id,
      });
    }

    if (existingReview.restaurant_id) {
      await supabase.rpc("update_restaurant_rating", {
        restaurant_id: existingReview.restaurant_id,
      });
    }

    res.json({ message: "Review berhasil dihapus" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ======================================================
// GET ALL REVIEWS (untuk AppContext initial load)
// ======================================================
router.get("/all", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, users(username, profile_image)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Format response dengan userName
    const formattedData = data?.map((review: any) => ({
      ...review,
      userName: review.users?.username || "User",
      profile_image: review.users?.profile_image || null,
    }));

    res.json(formattedData);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;