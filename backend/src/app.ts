// src/app.ts
import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

// Load .env file
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

// Define typed environment variable interface
interface Env {
  PORT: string;
  FRONTEND_URL: string;
  JWT_SECRET: string;
  NODE_ENV: string;
}

const requiredEnvVars: (keyof Env)[] = ['PORT', 'FRONTEND_URL', 'JWT_SECRET'];
const env: Env = {} as Env;
for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  if (!value || typeof value !== 'string') {
    console.error(`Invalid or missing environment variable: ${envVar}`);
    process.exit(1);
  }
  env[envVar] = value;
}

// Set NODE_ENV
env.NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: env.FRONTEND_URL || 'http://localhost:3000',
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
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
    const PORT = env.PORT || 5000;
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