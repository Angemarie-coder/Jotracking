import { Sequelize } from 'sequelize-typescript';
import type { Dialect } from 'sequelize';
import dotenv from 'dotenv';
import Job from '../models/Job.model';
import User from '../models/User.model';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

interface DatabaseConfig {
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
  host: string;
  port: number;
  dialect: Dialect;
  logging: boolean | ((...msg: any[]) => void);
  dialectOptions?: {
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
}

const databaseConfig: { [key: string]: DatabaseConfig } = {
  development: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST || 'localhost',
    port: Number(process.env.PG_PORT) || 5432,
    dialect: 'postgres' as const,
    logging: console.log,
  },

  production: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST || 'localhost',
    port: Number(process.env.PG_PORT) || 5432,
    dialect: 'postgres' as const,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

const config = databaseConfig[env as keyof typeof databaseConfig];

const sequelize = new Sequelize({
  ...config,
  models: [User, Job],
});

export { sequelize };
export default sequelize;
