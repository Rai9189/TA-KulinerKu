"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabaseServer_1 = require("../lib/supabaseServer");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const router = (0, express_1.Router)();
// ==================== ADMIN ROUTES ====================
// Get all users (Admin only)
router.get('/', auth_1.authenticateToken, (0, role_1.requireAdmin)(), async (req, res) => {
    try {
        const { data, error } = await supabaseServer_1.supabase
            .from('users')
            .select('id, username, email, role, created_at')
            .order('created_at', { ascending: false });
        if (error) {
            return res.status(500).json({ message: 'Failed to fetch users', error });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Get single user (Admin only)
router.get('/:id', auth_1.authenticateToken, (0, role_1.requireAdmin)(), async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabaseServer_1.supabase
            .from('users')
            .select('id, username, email, role, created_at')
            .eq('id', id)
            .single();
        if (error) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Update user role (Admin only)
router.put('/:id/role', auth_1.authenticateToken, (0, role_1.requireAdmin)(), async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        const { data, error } = await supabaseServer_1.supabase
            .from('users')
            .update({ role })
            .eq('id', id)
            .select('id, username, email, role, created_at')
            .single();
        if (error) {
            return res.status(500).json({ message: 'Failed to update user role', error });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Delete user by ID (Admin only)
router.delete('/:id', auth_1.authenticateToken, (0, role_1.requireAdmin)(), async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabaseServer_1.supabase.from('users').delete().eq('id', id);
        if (error) {
            return res.status(500).json({ message: 'Failed to delete user', error });
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// ==================== USER SELF-SERVICE ROUTES ====================
// 🆕 DELETE CURRENT USER ACCOUNT (Self-delete)
router.delete('/me/account', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // 1. Delete user's favorites (CASCADE sudah handle ini tapi untuk safety)
        await supabaseServer_1.supabase.from('favorites').delete().eq('user_id', userId);
        // 2. Delete user's reviews (CASCADE sudah handle ini tapi untuk safety)
        await supabaseServer_1.supabase.from('reviews').delete().eq('user_id', userId);
        // 3. Delete user account
        const { error } = await supabaseServer_1.supabase.from('users').delete().eq('id', userId);
        if (error) {
            console.error('Delete account error:', error);
            return res.status(500).json({ message: 'Failed to delete account', error });
        }
        res.json({
            message: 'Account deleted successfully',
            success: true
        });
    }
    catch (error) {
        console.error('Delete account exception:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = router;
