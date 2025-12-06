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
    // GET - Fetch restaurants
    if (req.method === 'GET') {
      const { id } = req.query;

      // Get specific restaurant by ID
      if (id) {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          return res.status(404).json({ 
            success: false,
            message: 'Restaurant not found' 
          });
        }

        return res.status(200).json({
          success: true,
          data: data
        });
      }

      // Get all restaurants
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to fetch restaurants', 
          error: error.message 
        });
      }

      return res.status(200).json({
        success: true,
        data: data
      });
    }

    // POST - Create restaurant (Admin only)
    if (req.method === 'POST') {
      const user = verifyToken(req.headers.authorization);

      if (!user || user.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied. Admin role required' 
        });
      }

      const { name, category, address, image, description, open_hours, price_range } = req.body;

      if (!name || !category) {
        return res.status(400).json({ 
          success: false,
          message: 'Name and category are required' 
        });
      }

      const { data, error } = await supabase
        .from('restaurants')
        .insert([{ 
          name, 
          category, 
          address, 
          image, 
          description, 
          open_hours, 
          price_range 
        }])
        .select()
        .single();

      if (error) {
        console.error('Create restaurant error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to create restaurant', 
          error: error.message 
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Restaurant created successfully',
        data: data
      });
    }

    // PUT - Update restaurant (Admin only)
    if (req.method === 'PUT') {
      const user = verifyToken(req.headers.authorization);

      if (!user || user.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied. Admin role required' 
        });
      }

      const { id } = req.query;
      const { name, category, address, image, description, open_hours, price_range } = req.body;

      if (!id) {
        return res.status(400).json({ 
          success: false,
          message: 'Restaurant ID is required' 
        });
      }

      const updates = {};
      if (name) updates.name = name;
      if (category) updates.category = category;
      if (address !== undefined) updates.address = address;
      if (image !== undefined) updates.image = image;
      if (description !== undefined) updates.description = description;
      if (open_hours !== undefined) updates.open_hours = open_hours;
      if (price_range !== undefined) updates.price_range = price_range;

      const { data, error } = await supabase
        .from('restaurants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update restaurant error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to update restaurant', 
          error: error.message 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Restaurant updated successfully',
        data: data
      });
    }

    // DELETE - Delete restaurant (Admin only)
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
          message: 'Restaurant ID is required' 
        });
      }

      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete restaurant error:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to delete restaurant', 
          error: error.message 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Restaurant deleted successfully'
      });
    }

    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  } catch (error) {
    console.error('Restaurant API error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
};