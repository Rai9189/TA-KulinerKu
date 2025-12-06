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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Fetch reviews
    if (req.method === 'GET') {
      const { id } = req.query;

      // Get specific review by ID
      if (id) {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            user:users(id, username, profile_image),
            restaurant:restaurants(id, name),
            menu:menu_items(id, name)
          `)
          .eq('id', id)
          .single();

        if (error) {
          return res.status(404).json({ 
            success: false,
            message: 'Review not found' 
          });
        }

        return res.status(200).json({
          success: true,
          data: data
        });
      }

      // Get all reviews
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users(id, username, profile_image),
          restaurant:restaurants(id, name),
          menu:menu_items(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to fetch reviews', 
          error: error.message 
        });
      }

      return res.status(200).json({
        success: true,
        data: data
      });
    }

    // POST - Create review (User authenticated)
    if (req.method === 'POST') {
      const user = verifyToken(req.headers.authorization);

      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Authentication required' 
        });
      }

      const { restaurant_id, menu_id, rating, comment } = req.body;

      // Validate: must have either restaurant_id OR menu_id (not both)
      if ((!restaurant_id && !menu_id) || (restaurant_id && menu_id)) {
        return res.status(400).json({ 
          success: false,
          message: 'Must provide either restaurant_id or menu_id, not both' 
        });
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ 
          success: false,
          message: 'Rating must be between 1 and 5' 
        });
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert([{ 
          user_id: user.id,
          restaurant_id, 
          menu_id, 
          rating, 
          comment 
        }])
        .select(`
          *,
          user:users(id, username, profile_image),
          restaurant:restaurants(id, name),
          menu:menu_items(id, name)
        `)
        .single();

      if (error) {
        console.error('Create review error:', error);
        
        // Check for duplicate review (from unique constraint)
        if (error.code === '23505') {
          return res.status(400).json({ 
            success: false,
            message: 'You have already reviewed this item' 
          });
        }

        return res.status(500).json({ 
          success: false,
          message: 'Failed to create review', 
          error: error.message 
        });
      }

      // Update rating for restaurant or menu
      if (restaurant_id) {
        await supabase.rpc('update_restaurant_rating', { p_restaurant_id: restaurant_id });
      }
      if (menu_id) {
        await supabase.rpc('update_menu_rating', { p_menu_id: menu_id });
      }

      return res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: data
      });
    }

    // PUT - Update review (User can only edit own review)
    if (req.method === 'PUT') {
      const user = verifyToken(req.headers.authorization);

      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Authentication required' 
        });
      }

      const { id } = req.query;
      const { rating, comment } = req.body;

      if (!id) {
        return res.status(400).json({ 
          success: false,
          message: 'Review ID is required' 
        });
      }

      // Check if review belongs to user
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('user_id, restaurant_id, menu_id')
        .eq('id', id)
        .single();

      if (!existingReview) {
        return res.status(404).json({ 
          success: false,
          message: 'Review not found' 
        });
      }

      if (existingReview.user_id !== user.id) {
        return res.status(403).json({ 
          success: false,
          message: 'You can only edit your own reviews' 
        });
      }

      const updates = {};
      if (rating) {
        if (rating < 1 || rating > 5) {
          return res.status(400).json({ 
            success: false,
            message: 'Rating must be between 1 and 5' 
          });
        }
        updates.rating = rating;
      }
      if (comment !== undefined) updates.comment = comment;

      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          user:users(id, username, profile_image),
          restaurant:restaurants(id, name),
          menu:menu_items(id, name)
        `)
        .single();

      if (error) {
        console.error('Update review error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to update review', 
          error: error.message 
        });
      }

      // Update rating for restaurant or menu
      if (existingReview.restaurant_id) {
        await supabase.rpc('update_restaurant_rating', { p_restaurant_id: existingReview.restaurant_id });
      }
      if (existingReview.menu_id) {
        await supabase.rpc('update_menu_rating', { p_menu_id: existingReview.menu_id });
      }

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: data
      });
    }

    // DELETE - Delete review (User can only delete own review)
    if (req.method === 'DELETE') {
      const user = verifyToken(req.headers.authorization);

      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Authentication required' 
        });
      }

      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ 
          success: false,
          message: 'Review ID is required' 
        });
      }

      // Check if review belongs to user
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('user_id, restaurant_id, menu_id')
        .eq('id', id)
        .single();

      if (!existingReview) {
        return res.status(404).json({ 
          success: false,
          message: 'Review not found' 
        });
      }

      if (existingReview.user_id !== user.id) {
        return res.status(403).json({ 
          success: false,
          message: 'You can only delete your own reviews' 
        });
      }

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete review error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to delete review', 
          error: error.message 
        });
      }

      // Update rating for restaurant or menu
      if (existingReview.restaurant_id) {
        await supabase.rpc('update_restaurant_rating', { p_restaurant_id: existingReview.restaurant_id });
      }
      if (existingReview.menu_id) {
        await supabase.rpc('update_menu_rating', { p_menu_id: existingReview.menu_id });
      }

      return res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });
    }

    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  } catch (error) {
    console.error('Review API error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      message: error.message 
    });
  }
};