// src/config/db.ts
import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import dotenv from 'dotenv';
import User from '../models/User.model';
import Job from '../models/Job.model';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Use default values if environment variables are missing
const env = {
  DB_USERNAME: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || '5432',
  DB_NAME: process.env.DB_NAME || 'job_tracker'
};

console.log('Database configuration:', {
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USERNAME
});

const connectDB = async () => {
  try {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      host: env.DB_HOST,
      port: parseInt(env.DB_PORT, 10),
      database: env.DB_NAME,
      models: [User, Job],
      logging: false, // Disable SQL logging for cleaner output
      define: {
        underscored: true, // Use snake_case for column names
        freezeTableName: true, // Prevent Sequelize from pluralizing table names
      },
      // PostgreSQL-specific optimizations
      pool: {
        max: 20, // Maximum number of connection instances
        min: 0,  // Minimum number of connection instances
        acquire: 30000, // Maximum time (ms) that pool will try to get connection before throwing error
        idle: 10000 // Maximum time (ms) that a connection can be idle before being released
      },
      dialectOptions: {
        // PostgreSQL-specific options
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        // Enable JSON operators for better performance
        supportBigNumbers: true,
        bigNumberStrings: true
      }
    });

    await sequelize.authenticate();
    console.log('Connected to PostgreSQL database');
    return sequelize;
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    console.log('Starting server without database connection for testing...');
    return null;
  }
};

export default connectDB;