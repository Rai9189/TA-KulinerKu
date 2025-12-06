const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const user = verifyToken(req.headers.authorization);

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    // GET all users (Admin only)
    if (req.method === 'GET') {
      const { id } = req.query;

      // Get specific user by ID (Admin only)
      if (id) {
        if (user.role !== 'admin') {
          return res.status(403).json({ 
            success: false,
            message: 'Access denied. Admin role required' 
          });
        }

        const { data, error } = await supabase
          .from('users')
          .select('id, username, email, role, profile_image, bio, created_at')
          .eq('id', id)
          .single();

        if (error) {
          return res.status(404).json({ 
            success: false,
            message: 'User not found' 
          });
        }

        return res.status(200).json({
          success: true,
          data: data
        });
      }

      // Get all users (Admin only)
      if (user.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied. Admin role required' 
        });
      }

      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, role, profile_image, bio, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to fetch users', 
          error: error.message 
        });
      }

      return res.status(200).json({
        success: true,
        data: data
      });
    }

    // PUT - Update user profile
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { username, bio, profile_image, role } = req.body;

      // Admin can update any user
      if (id && user.role === 'admin') {
        const updates = {};
        if (username) updates.username = username;
        if (bio !== undefined) updates.bio = bio;
        if (profile_image !== undefined) updates.profile_image = profile_image;
        if (role) updates.role = role;

        const { data, error } = await supabase
          .from('users')
          .update(updates)
          .eq('id', id)
          .select('id, username, email, role, profile_image, bio, created_at')
          .single();

        if (error) {
          console.error('Update user error:', error);
          return res.status(500).json({ 
            success: false,
            message: 'Failed to update user', 
            error: error.message 
          });
        }

        return res.status(200).json({
          success: true,
          message: 'User updated successfully',
          data: data
        });
      }

      // User can only update their own profile
      const updates = {};
      if (username) updates.username = username;
      if (bio !== undefined) updates.bio = bio;
      if (profile_image !== undefined) updates.profile_image = profile_image;

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select('id, username, email, role, profile_image, bio, created_at')
        .single();

      if (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to update profile', 
          error: error.message 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: data
      });
    }

    // DELETE user account
    if (req.method === 'DELETE') {
      const { id } = req.query;

      // Admin can delete any user
      if (id && user.role === 'admin') {
        const { error } = await supabase.from('users').delete().eq('id', id);

        if (error) {
          console.error('Delete user error:', error);
          return res.status(500).json({ 
            success: false,
            message: 'Failed to delete user', 
            error: error.message 
          });
        }

        return res.status(200).json({ 
          success: true,
          message: 'User deleted successfully' 
        });
      }

      // User can only delete their own account
      const { error } = await supabase.from('users').delete().eq('id', user.id);

      if (error) {
        console.error('Delete account error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to delete account', 
          error: error.message 
        });
      }

      return res.status(200).json({ 
        success: true,
        message: 'User account deleted successfully' 
      });
    }

    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  } catch (error) {
    console.error('Users API error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      message: error.message 
    });
  }
};