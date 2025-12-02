const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query; // ?action=login atau ?action=register

  try {
    // REGISTER
    if (action === 'register' && req.method === 'POST') {
      const { username, email, password, role = 'user' } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Cek email sudah ada
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const { data, error } = await supabase
        .from('users')
        .insert([{ username, email, password: hashedPassword, role }])
        .select()
        .single();

      if (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Failed to create user', error: error.message });
      }

      return res.status(201).json({ message: 'User registered successfully', user: data });
    }

    // LOGIN
    if (action === 'login' && req.method === 'POST') {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Cari user
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verifikasi password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return tanpa password
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: userWithoutPassword,
      });
    }

    return res.status(400).json({ error: 'Invalid action or method' });
  } catch (error) {
    console.error('Auth API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};