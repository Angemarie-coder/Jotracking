// src/app.ts
import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import jobRoutes from './routes/jobs';

// Load .env file
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.log('No .env file found, using default values');
}

// Define typed environment variable interface
interface Env {
  PORT: string;
  FRONTEND_URL: string;
  JWT_SECRET: string;
  NODE_ENV: string;
}

    // Use default values if environment variables are missing
    const env: Env = {
      PORT: process.env.PORT || '5000',
      FRONTEND_URL: process.env.FRONTEND_URL || 'http://192.168.1.64:8081',
      JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
      NODE_ENV: process.env.NODE_ENV || 'development'
    };

console.log('Environment configuration:', {
  PORT: env.PORT,
  NODE_ENV: env.NODE_ENV,
  FRONTEND_URL: env.FRONTEND_URL
});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

    // CORS configuration
    const corsOptions = {
      origin: [
        env.FRONTEND_URL || 'http://localhost:3000',
        'http://192.168.1.64:8081', // Expo development server
        'http://192.168.1.124:19006', // Expo web
        'exp://192.168.1.64:8081' // Expo app
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Range', 'X-Total-Count']
    };

app.use(cors(corsOptions));

// Logging middleware for development
if (env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Email verification page
app.get('/verify-email', (req, res) => {
  console.log('Serving verification page');
  res.sendFile(path.join(__dirname, '../public/verify-email.html'));
});

// Test endpoint for debugging
app.get('/api/test-verification', (req, res) => {
  console.log('Test verification endpoint called');
  res.json({ success: true, message: 'Test endpoint working' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Connect to database
connectDB()
  .then(() => {
    console.log('Database connected successfully');
    
    // Start the server
    const PORT = env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

export default app;