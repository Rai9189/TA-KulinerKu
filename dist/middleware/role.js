"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireUser = exports.checkRole = void 0;
// ==========================================================
//       CHECK ROLE MULTIPLE  (admin-only, user-only, etc.)
// ==========================================================
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
exports.checkRole = checkRole;
// ==========================================================
//       CHECK LOGGED-IN USER (USER or ADMIN)
//       Guest otomatis ditolak
// ==========================================================
const requireUser = () => {
    return (req, res, next) => {
        if (!req.user || req.user.role === 'guest') {
            return res.status(401).json({ message: 'Login required' });
        }
        next();
    };
};
exports.requireUser = requireUser;
// ==========================================================
//       CHECK ADMIN ONLY
// ==========================================================
const requireAdmin = () => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' });
        }
        next();
    };
};
exports.requireAdmin = requireAdmin;
