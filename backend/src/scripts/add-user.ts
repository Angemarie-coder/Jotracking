// src/scripts/add-user.ts
import { Sequelize } from 'sequelize-typescript';
import User from '../models/User.model';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from '../config/db';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function addUser() {
  try {
    console.log('🌱 Adding new user...');
    
    const sequelize = await connectDB();
    if (!sequelize) {
      console.error('Database connection failed');
      process.exit(1);
    }

    // Create new user
    const user = await User.create({
      firstName: 'Angemarie',
      lastName: 'Uwineza',
      email: 'uwineza.angemarie@gmail.com',
      password: 'password123',
      isVerified: true,
      isAdmin: false
    });

    console.log(`✅ Successfully created user: ${user.email}`);
    console.log(`User ID: ${user.id}`);
    console.log(`Password: password123`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding user:', error);
    process.exit(1);
  }
}

addUser();
