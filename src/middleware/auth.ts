import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { supabase } from '../lib/supabaseServer';

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ================================
//    MIDDLEWARE: OPTIONAL AUTH
//    (untuk Guest Mode)
// ================================
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Jika tidak ada token → guest
  if (!authHeader) {
    (req as any).user = { role: "guest" };
    return next();
  }

  const token = authHeader.split(" ")[1];
  
  try {
    // ⭐ DECODE TOKEN (bisa berisi id atau JWT payload)
    let userId: string;
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      userId = decoded.id || decoded.userId || token; // Support JWT atau plain ID
    } catch {
      // Jika bukan JWT, anggap token = user ID langsung
      userId = token;
    }

    // ⭐ FETCH USER DATA DARI DATABASE
    const { data: userData, error } = await supabase
      .from("users")
      .select("id, username, email, role, profile_image, bio")
      .eq("id", userId)
      .single();

    if (error || !userData) {
      // User tidak ditemukan → guest
      (req as any).user = { role: "guest" };
      return next();
    }

    // ⭐ SET USER DATA LENGKAP
    (req as any).user = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      profile_image: userData.profile_image,
      bio: userData.bio,
    };

    next();
  } catch (err) {
    console.error("optionalAuth error:", err);
    (req as any).user = { role: "guest" };
    next();
  }
};

// ================================
//    MIDDLEWARE: HARUS LOGIN
// ================================
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Login required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ⭐ DECODE TOKEN
    let userId: string;
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      userId = decoded.id || decoded.userId || token;
    } catch {
      userId = token;
    }

    // ⭐ FETCH USER DATA DARI DATABASE
    const { data: userData, error } = await supabase
      .from("users")
      .select("id, username, email, role, profile_image, bio")
      .eq("id", userId)
      .single();

    if (error || !userData) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // ⭐ SET USER DATA LENGKAP
    (req as any).user = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      profile_image: userData.profile_image,
      bio: userData.bio,
    };

    next();
  } catch (err) {
    console.error("authenticate error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ================================
//     MIDDLEWARE: ROLE CHECKER
// ================================
export const authorize = (roles: Array<"admin" | "user">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (!roles.includes(user.role))
      return res.status(403).json({ message: "Forbidden" });

    next();
  };
};