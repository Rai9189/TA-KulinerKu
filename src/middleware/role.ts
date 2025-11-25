import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: {
    id?: string;
    role: "guest" | "user" | "admin";
  };
}

// ==========================================================
//       CHECK ROLE MULTIPLE  (admin-only, user-only, etc.)
// ==========================================================
export const checkRole = (roles: Array<"admin" | "user">) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

// ==========================================================
//       CHECK LOGGED-IN USER (USER or ADMIN)
//       Guest otomatis ditolak
// ==========================================================
export const requireUser = () => {
  return (req: AuthRequest, res: Response, Next: NextFunction) => {
    if (!req.user || req.user.role === "guest") {
      return res.status(401).json({ message: "Login required" });
    }
    Next();
  };
};

// ==========================================================
//       CHECK ADMIN ONLY
// ==========================================================
export const requireAdmin = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
    next();
  };
};
