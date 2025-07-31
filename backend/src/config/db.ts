// src/config/db.ts
import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import dotenv from 'dotenv';
import User from '../models/User.model';
import Job from '../models/Job.model';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Define typed environment variable interface
interface Env {
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_NAME: string;
}

const requiredEnvVars: (keyof Env)[] = ['DB_USERNAME', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME'];
const env: Env = {} as Env;
for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  if (!value || typeof value !== 'string') {
    console.error(`Invalid or missing environment variable: ${envVar}`);
    process.exit(1);
  }
  env[envVar] = value;
}

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
    });

    await sequelize.authenticate();
    console.log('Connected to PostgreSQL database');
    return sequelize;
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};

export default connectDB;