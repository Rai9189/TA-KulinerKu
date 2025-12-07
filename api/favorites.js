const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Verify JWT token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {object|null} Decoded user object or null if invalid
 */
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

/**
 * Main handler for Favorites API
 * Supports GET, POST, DELETE methods
 */
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Verify user authentication
    const user = verifyToken(req.headers.authorization);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    // GET - Fetch user's favorites
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          restaurant:restaurants(*),
          menu:menu_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to fetch favorites', 
          error: error.message 
        });
      }

      return res.status(200).json({
        success: true,
        data: data
      });
    }

    // POST - Add to favorites
    if (req.method === 'POST') {
      const { restaurant_id, menu_id } = req.body;

      // Validate: must have either restaurant_id OR menu_id (not both)
      if ((!restaurant_id && !menu_id) || (restaurant_id && menu_id)) {
        return res.status(400).json({ 
          success: false,
          message: 'Must provide either restaurant_id or menu_id, not both' 
        });
      }

      const { data, error } = await supabase
        .from('favorites')
        .insert([{ 
          user_id: user.id,
          restaurant_id, 
          menu_id 
        }])
        .select(`
          *,
          restaurant:restaurants(*),
          menu:menu_items(*)
        `)
        .single();

      if (error) {
        console.error('Add favorite error:', error);
        
        // Check for duplicate favorite (unique constraint violation)
        if (error.code === '23505') {
          return res.status(400).json({ 
            success: false,
            message: 'Already in favorites' 
          });
        }

        return res.status(500).json({ 
          success: false,
          message: 'Failed to add favorite', 
          error: error.message 
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Added to favorites successfully',
        data: data
      });
    }

    // DELETE - Remove from favorites
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ 
          success: false,
          message: 'Favorite ID is required' 
        });
      }

      // Check if favorite exists and belongs to user
      const { data: existingFavorite } = await supabase
        .from('favorites')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existingFavorite) {
        return res.status(404).json({ 
          success: false,
          message: 'Favorite not found' 
        });
      }

      if (existingFavorite.user_id !== user.id) {
        return res.status(403).json({ 
          success: false,
          message: 'You can only delete your own favorites' 
        });
      }

      // Delete the favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete favorite error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to remove favorite', 
          error: error.message 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Removed from favorites successfully'
      });
    }

    // Method not allowed
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });

  } catch (error) {
    console.error('Favorites API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};