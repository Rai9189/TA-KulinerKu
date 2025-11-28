import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabaseServer';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Validasi input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Cek apakah email sudah terdaftar
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

    // Insert user baru
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          email,
          password: hashedPassword,
          role,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to create user', error });
    }

    res.status(201).json({ message: 'User registered successfully', user: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Cari user berdasarkan email
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

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Return user data tanpa password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;