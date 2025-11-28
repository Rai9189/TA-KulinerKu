import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

// ==========================================================
//       CHECK ROLE MULTIPLE  (admin-only, user-only, etc.)
// ==========================================================
export const checkRole = (roles: Array<'admin' | 'user' | 'guest'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

// ==========================================================
//       CHECK LOGGED-IN USER (USER or ADMIN)
//       Guest otomatis ditolak
// ==========================================================
export const requireUser = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role === 'guest') {
      return res.status(401).json({ message: 'Login required' });
    }
    next();
  };
};

// ==========================================================
//       CHECK ADMIN ONLY
// ==========================================================
export const requireAdmin = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    next();
  };
};