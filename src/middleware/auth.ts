import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ================================
//    MIDDLEWARE: OPTIONAL AUTH
//    (untuk Guest Mode)
// ================================
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Jika tidak ada token → guest
  if (!authHeader) {
    (req as any).user = { role: "guest" };
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch {
    (req as any).user = { role: "guest" }; // token rusak → tetap guest
    next();
  }
};

// ================================
//    MIDDLEWARE: HARUS LOGIN
// ================================
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Login required" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
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
