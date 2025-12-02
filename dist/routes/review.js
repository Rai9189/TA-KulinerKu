"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabaseServer_1 = require("../lib/supabaseServer");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all reviews (Public)
router.get('/all', async (req, res) => {
    try {
        const { data, error } = await supabaseServer_1.supabase
            .from('reviews')
            .select(`
        *,
        user:users(username),
        restaurant:restaurants(name),
        menu:menu_items(name)
      `)
            .order('created_at', { ascending: false });
        if (error) {
            return res.status(500).json({ message: 'Failed to fetch reviews', error });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Get reviews by user ID
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { data, error } = await supabaseServer_1.supabase
            .from('reviews')
            .select(`
        *,
        user:users(username),
        restaurant:restaurants(name),
        menu:menu_items(name)
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) {
            return res.status(500).json({ message: 'Failed to fetch user reviews', error });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Get reviews by restaurant ID
router.get('/restaurant/:restaurantId', async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { data, error } = await supabaseServer_1.supabase
            .from('reviews')
            .select(`
        *,
        user:users(username),
        restaurant:restaurants(name)
      `)
            .eq('restaurant_id', restaurantId)
            .order('created_at', { ascending: false });
        if (error) {
            return res.status(500).json({ message: 'Failed to fetch reviews', error });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Get reviews by menu ID
router.get('/menu/:menuId', async (req, res) => {
    try {
        const { menuId } = req.params;
        const { data, error } = await supabaseServer_1.supabase
            .from('reviews')
            .select(`
        *,
        user:users(username),
        menu:menu_items(name)
      `)
            .eq('menu_id', menuId)
            .order('created_at', { ascending: false });
        if (error) {
            return res.status(500).json({ message: 'Failed to fetch reviews', error });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// ⭐ NEW: Check if user already reviewed (untuk frontend)
router.get('/check/:targetType/:targetId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { targetType, targetId } = req.params;
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        let query = supabaseServer_1.supabase
            .from('reviews')
            .select('*')
            .eq('user_id', user_id);
        if (targetType === 'restaurant') {
            query = query.eq('restaurant_id', targetId);
        }
        else if (targetType === 'menu') {
            query = query.eq('menu_id', targetId);
        }
        else {
            return res.status(400).json({ message: 'Invalid target type' });
        }
        const { data, error } = await query.maybeSingle();
        if (error) {
            return res.status(500).json({ message: 'Failed to check review', error });
        }
        // Return existing review atau null
        res.json({ hasReviewed: !!data, review: data || null });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Create review - DENGAN ANTI-SPAM VALIDATION
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { restaurant_id, menu_id, rating, comment } = req.body;
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (!restaurant_id && !menu_id) {
            return res.status(400).json({ message: 'Either restaurant_id or menu_id is required' });
        }
        // ⭐ ANTI-SPAM: Cek apakah user sudah review sebelumnya
        let existingQuery = supabaseServer_1.supabase
            .from('reviews')
            .select('id')
            .eq('user_id', user_id);
        if (restaurant_id) {
            existingQuery = existingQuery.eq('restaurant_id', restaurant_id);
        }
        else if (menu_id) {
            existingQuery = existingQuery.eq('menu_id', menu_id);
        }
        const { data: existingReview } = await existingQuery.maybeSingle();
        if (existingReview) {
            return res.status(400).json({
                message: 'Anda sudah memberikan review untuk item ini. Silakan edit review Anda yang sudah ada.',
                code: 'DUPLICATE_REVIEW'
            });
        }
        // Insert review jika belum ada
        const { data, error } = await supabaseServer_1.supabase
            .from('reviews')
            .insert([
            {
                user_id,
                restaurant_id: restaurant_id || null,
                menu_id: menu_id || null,
                rating,
                comment,
            },
        ])
            .select()
            .single();
        if (error) {
            console.error('Insert review error:', error);
            // Handle database constraint violation
            if (error.code === '23505') { // Unique constraint violation
                return res.status(400).json({
                    message: 'Anda sudah memberikan review untuk item ini.',
                    code: 'DUPLICATE_REVIEW'
                });
            }
            return res.status(500).json({ message: 'Failed to create review', error });
        }
        res.status(201).json(data);
    }
    catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
// Update review (Own review only)
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        // Check if review belongs to user
        const { data: existingReview } = await supabaseServer_1.supabase
            .from('reviews')
            .select('*')
            .eq('id', id)
            .single();
        if (!existingReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (existingReview.user_id !== user_id) {
            return res.status(403).json({ message: 'You can only edit your own reviews' });
        }
        const { data, error } = await supabaseServer_1.supabase
            .from('reviews')
            .update({ rating, comment })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            return res.status(500).json({ message: 'Failed to update review', error });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Delete review (Own review only or Admin)
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user?.id;
        const user_role = req.user?.role;
        // Check if review belongs to user
        const { data: existingReview } = await supabaseServer_1.supabase
            .from('reviews')
            .select('*')
            .eq('id', id)
            .single();
        if (!existingReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (existingReview.user_id !== user_id && user_role !== 'admin') {
            return res.status(403).json({ message: 'You can only delete your own reviews' });
        }
        const { error } = await supabaseServer_1.supabase.from('reviews').delete().eq('id', id);
        if (error) {
            return res.status(500).json({ message: 'Failed to delete review', error });
        }
        res.json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = router;
