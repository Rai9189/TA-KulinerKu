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
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
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

    // DELETE current user account
    if (req.method === 'DELETE') {
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