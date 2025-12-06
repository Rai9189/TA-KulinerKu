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
    // GET - Fetch menus
    if (req.method === 'GET') {
      const { id, restaurantId } = req.query;

      // Get specific menu by ID
      if (id) {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          return res.status(404).json({ 
            success: false,
            message: 'Menu not found' 
          });
        }

        return res.status(200).json({
          success: true,
          data: data
        });
      }

      // Get menus by restaurant or all menus
      let query = supabase.from('menu_items').select('*');
      
      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to fetch menus', 
          error: error.message 
        });
      }

      return res.status(200).json({
        success: true,
        data: data
      });
    }

    // POST - Create menu (Admin only)
    if (req.method === 'POST') {
      const user = verifyToken(req.headers.authorization);

      if (!user || user.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied. Admin role required' 
        });
      }

      const { name, category, price, image, description, restaurant_id } = req.body;

      if (!name || !category || !price || !restaurant_id) {
        return res.status(400).json({ 
          success: false,
          message: 'Name, category, price, and restaurant_id are required' 
        });
      }

      const { data, error } = await supabase
        .from('menu_items')
        .insert([{ 
          name, 
          category, 
          price, 
          image, 
          description, 
          restaurant_id 
        }])
        .select()
        .single();

      if (error) {
        console.error('Create menu error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to create menu', 
          error: error.message 
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Menu created successfully',
        data: data
      });
    }

    // PUT - Update menu (Admin only)
    if (req.method === 'PUT') {
      const user = verifyToken(req.headers.authorization);

      if (!user || user.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied. Admin role required' 
        });
      }

      const { id } = req.query;
      const { name, category, price, image, description } = req.body;

      if (!id) {
        return res.status(400).json({ 
          success: false,
          message: 'Menu ID is required' 
        });
      }

      const updates = {};
      if (name) updates.name = name;
      if (category) updates.category = category;
      if (price) updates.price = price;
      if (image !== undefined) updates.image = image;
      if (description !== undefined) updates.description = description;

      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update menu error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to update menu', 
          error: error.message 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Menu updated successfully',
        data: data
      });
    }

    // DELETE - Delete menu (Admin only)
    if (req.method === 'DELETE') {
      const user = verifyToken(req.headers.authorization);

      if (!user || user.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied. Admin role required' 
        });
      }

      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ 
          success: false,
          message: 'Menu ID is required' 
        });
      }

      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete menu error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to delete menu', 
          error: error.message 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Menu deleted successfully'
      });
    }

    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  } catch (error) {
    console.error('Menu API error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      message: error.message 
    });
  }
};