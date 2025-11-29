import { Router, Response } from 'express';
import { AuthRequest } from '../types';
import { supabase } from '../lib/supabaseServer';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/role';

const router = Router();

// ==================== ADMIN ROUTES ====================

// Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin(), async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch users', error });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get single user (Admin only)
router.get('/:id', authenticateToken, requireAdmin(), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role, created_at')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update user role (Admin only)
router.put('/:id/role', authenticateToken, requireAdmin(), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select('id, username, email, role, created_at')
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update user role', error });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete user by ID (Admin only)
router.delete('/:id', authenticateToken, requireAdmin(), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      return res.status(500).json({ message: 'Failed to delete user', error });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// ==================== USER SELF-SERVICE ROUTES ====================

// 🆕 DELETE CURRENT USER ACCOUNT (Self-delete)
router.delete('/me/account', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 1. Delete user's favorites (CASCADE sudah handle ini tapi untuk safety)
    await supabase.from('favorites').delete().eq('user_id', userId);

    // 2. Delete user's reviews (CASCADE sudah handle ini tapi untuk safety)
    await supabase.from('reviews').delete().eq('user_id', userId);

    // 3. Delete user account
    const { error } = await supabase.from('users').delete().eq('id', userId);

    if (error) {
      console.error('Delete account error:', error);
      return res.status(500).json({ message: 'Failed to delete account', error });
    }

    res.json({ 
      message: 'Account deleted successfully',
      success: true 
    });
  } catch (error) {
    console.error('Delete account exception:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;