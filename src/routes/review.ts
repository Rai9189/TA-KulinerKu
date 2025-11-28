import { Router, Response } from 'express';
import { AuthRequest } from '../types';
import { supabase } from '../lib/supabaseServer';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all reviews (Public)
router.get('/all', async (req, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(username)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch reviews', error });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get reviews by restaurant ID (Public)
router.get('/restaurant/:restaurantId', async (req, res: Response) => {
  try {
    const { restaurantId } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(username)
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch reviews', error });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get reviews by menu ID (Public)
router.get('/menu/:menuId', async (req, res: Response) => {
  try {
    const { menuId } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(username)
      `)
      .eq('menu_id', menuId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch reviews', error });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create review (Authenticated users only)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { restaurant_id, menu_id, rating, comment } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!restaurant_id && !menu_id) {
      return res.status(400).json({ message: 'Either restaurant_id or menu_id is required' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          user_id,
          restaurant_id,
          menu_id,
          rating,
          comment,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to create review', error });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update review (Own review only)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user?.id;

    // Check if review belongs to user
    const { data: existingReview } = await supabase
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

    const { data, error } = await supabase
      .from('reviews')
      .update({ rating, comment })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update review', error });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete review (Own review only or Admin)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;
    const user_role = req.user?.role;

    // Check if review belongs to user
    const { data: existingReview } = await supabase
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

    const { error } = await supabase.from('reviews').delete().eq('id', id);

    if (error) {
      return res.status(500).json({ message: 'Failed to delete review', error });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;