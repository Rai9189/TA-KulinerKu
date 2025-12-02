"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabaseServer_1 = require("../lib/supabaseServer");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const router = (0, express_1.Router)();
// Get all menus (Public)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabaseServer_1.supabase
            .from('menus')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            return res.status(500).json({ message: 'Failed to fetch menus', error });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Get menus by restaurant ID (Public)
router.get('/restaurant/:restaurantId', async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { data, error } = await supabaseServer_1.supabase
            .from('menus')
            .select('*')
            .eq('restaurant_id', restaurantId)
            .order('created_at', { ascending: false });
        if (error) {
            return res.status(500).json({ message: 'Failed to fetch menus', error });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Get single menu by ID (Public)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabaseServer_1.supabase
            .from('menus')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Create menu (Admin only)
router.post('/', auth_1.authenticateToken, (0, role_1.requireAdmin)(), async (req, res) => {
    try {
        const { restaurant_id, name, description, price, category, image_url, is_available } = req.body;
        const { data, error } = await supabaseServer_1.supabase
            .from('menus')
            .insert([
            {
                restaurant_id,
                name,
                description,
                price,
                category,
                image_url,
                is_available: is_available ?? true,
            },
        ])
            .select()
            .single();
        if (error) {
            return res.status(500).json({ message: 'Failed to create menu', error });
        }
        res.status(201).json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Update menu (Admin only)
router.put('/:id', auth_1.authenticateToken, (0, role_1.requireAdmin)(), async (req, res) => {
    try {
        const { id } = req.params;
        const { restaurant_id, name, description, price, category, image_url, is_available } = req.body;
        const { data, error } = await supabaseServer_1.supabase
            .from('menus')
            .update({
            restaurant_id,
            name,
            description,
            price,
            category,
            image_url,
            is_available,
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            return res.status(500).json({ message: 'Failed to update menu', error });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Delete menu (Admin only)
router.delete('/:id', auth_1.authenticateToken, (0, role_1.requireAdmin)(), async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabaseServer_1.supabase.from('menus').delete().eq('id', id);
        if (error) {
            return res.status(500).json({ message: 'Failed to delete menu', error });
        }
        res.json({ message: 'Menu deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = router;
