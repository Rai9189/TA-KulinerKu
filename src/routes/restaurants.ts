import { Router, Response } from 'express';
import { AuthRequest } from '../types';
import { supabase } from '../lib/supabaseServer';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/role';

const router = Router();

// Get all restaurants (Public)
router.get('/', async (req, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch restaurants', error });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get single restaurant by ID (Public)
router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create restaurant (Admin only)
router.post('/', authenticateToken, requireAdmin(), async (req: AuthRequest, res: Response) => {
  try {
    const { name, address, city, cuisine_type, description, image_url } = req.body;

    const { data, error } = await supabase
      .from('restaurants')
      .insert([
        {
          name,
          address,
          city,
          cuisine_type,
          description,
          image_url,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to create restaurant', error });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update restaurant (Admin only)
router.put('/:id', authenticateToken, requireAdmin(), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, city, cuisine_type, description, image_url } = req.body;

    const { data, error } = await supabase
      .from('restaurants')
      .update({
        name,
        address,
        city,
        cuisine_type,
        description,
        image_url,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update restaurant', error });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete restaurant (Admin only)
router.delete('/:id', authenticateToken, requireAdmin(), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('restaurants').delete().eq('id', id);

    if (error) {
      return res.status(500).json({ message: 'Failed to delete restaurant', error });
    }

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;