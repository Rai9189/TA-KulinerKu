// api/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Direct handler tanpa Express
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Import modules secara dynamic
    const express = require('express');
    const cors = require('cors');
    
    const app = express();
    
    // Middleware
    app.use(cors({
      origin: '*',
      credentials: true
    }));
    app.use(express.json());

    // Import routes dengan require
    const authRoutes = require('../src/routes/auth').default;
    const restaurantRoutes = require('../src/routes/restaurants').default;
    const menuRoutes = require('../src/routes/menu').default;
    const reviewRoutes = require('../src/routes/review').default;
    const userRoutes = require('../src/routes/users').default;

    // Mount routes
    app.use('/api/auth', authRoutes);
    app.use('/api/restaurants', restaurantRoutes);
    app.use('/api/menus', menuRoutes);
    app.use('/api/reviews', reviewRoutes);
    app.use('/api/users', userRoutes);

    // Health check
    app.get('/api/health', (req: any, res: any) => {
      res.json({ 
        status: 'ok', 
        message: 'KulinerKu API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
      });
    });

    // Root endpoint
    app.get('/api', (req: any, res: any) => {
      res.json({ 
        message: 'KulinerKu API',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          restaurants: '/api/restaurants',
          menus: '/api/menus',
          reviews: '/api/reviews',
          users: '/api/users',
          health: '/api/health'
        }
      });
    });

    // 404 handler
    app.use((req: any, res: any) => {
      res.status(404).json({ 
        error: 'Route not found',
        path: req.path,
        method: req.method
      });
    });

    // Error handler
    app.use((err: any, req: any, res: any, next: any) => {
      console.error('Error:', err);
      res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
      });
    });

    // Handle the request
    return app(req, res);
  } catch (error: any) {
    console.error('Handler error:', error);
    return res.status(500).json({
      error: 'Failed to initialize API',
      message: error.message
    });
  }
}