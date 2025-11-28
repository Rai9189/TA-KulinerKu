import { Router, Response } from 'express';
import { AuthRequest } from '../types';
import { supabase } from '../lib/supabaseServer';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/role';

const router = Router();

// Get all menus (Public)
router.get('/', async (req, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch menus', error });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get menus by restaurant ID (Public)
router.get('/restaurant/:restaurantId', async (req, res: Response) => {
  try {
    const { restaurantId } = req.params;

    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch menus', error });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get single menu by ID (Public)
router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create menu (Admin only)
router.post('/', authenticateToken, requireAdmin(), async (req: AuthRequest, res: Response) => {
  try {
    const { restaurant_id, name, description, price, category, image_url, is_available } = req.body;

    const { data, error } = await supabase
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update menu (Admin only)
router.put('/:id', authenticateToken, requireAdmin(), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { restaurant_id, name, description, price, category, image_url, is_available } = req.body;

    const { data, error } = await supabase
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete menu (Admin only)
router.delete('/:id', authenticateToken, requireAdmin(), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('menus').delete().eq('id', id);

    if (error) {
      return res.status(500).json({ message: 'Failed to delete menu', error });
    }

    res.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;