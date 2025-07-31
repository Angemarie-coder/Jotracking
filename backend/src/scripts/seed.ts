// src/script/seed.ts
import { Sequelize } from 'sequelize-typescript';
import User from '../models/User.model';
import Job, { JobStatus } from '../models/Job.model';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from '../config/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Define test users
const testUsers = [
  {
    firstName: 'Admin',
    lastName: 'Ange',
    email: 'admin@gmail.com',
    password: 'admin123',
    isAdmin: true,
    isVerified: true
  },
  {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@gmail.com',
    password: 'test123',
    isAdmin: false,
    isVerified: true
  },
  {
    firstName: 'Unverified',
    lastName: 'User',
    email: 'unverified@gmail.com',
    password: 'unverified123',
    isAdmin: false,
    isVerified: false
  }
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    const sequelize = await connectDB();
    await sequelize.sync({ force: false }); // Don't force sync in production

    // Hash passwords and generate verification tokens
    const usersToCreate = await Promise.all(testUsers.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const userData: any = {
        ...user,
        password: hashedPassword
      };

      // Only generate verification token for unverified users
      if (!user.isVerified) {
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date();
        expires.setHours(expires.getHours() + 24); // 24 hours from now
        
        userData.verificationToken = token;
        userData.verificationTokenExpires = expires;
      }

      return userData;
    }));

    // Create users one by one to handle any errors individually
    const createdUsers = [];
    for (const userData of usersToCreate) {
      try {
        const user = await User.create(userData);
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.email}`);
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.email}:`, error);
      }
    }

    console.log(`✅ Successfully created ${createdUsers.length} users`);
    
    // Create some test jobs
    const jobs = [
      {
        title: 'Senior Developer',
        company: 'Tech Corp',
        description: 'Looking for an experienced developer',
        jobLocation: 'Remote',
        status: 'applied',
        userId: createdUsers[0].id,
        appliedDate: new Date(),
        notes: 'Need to follow up next week',
        url: 'https://example.com/job/123',
        salary: '$90,000 - $120,000'
      },
      {
        title: 'Product Manager',
        company: 'Startup Inc',
        description: 'Product management role with technical team',
        jobLocation: 'New York, NY',
        status: 'interviewing',
        userId: createdUsers[1].id,
        appliedDate: new Date(),
        interviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        url: 'https://example.com/job/124',
        salary: '$110,000 - $140,000'
      }
    ];

    // Create jobs one by one to handle any errors individually
    const createdJobs = [];
    for (const jobData of jobs) {
      try {
        const job = await Job.create(jobData);
        createdJobs.push(job);
        console.log(`✅ Created job: ${job.title} at ${job.company}`);
      } catch (error) {
        console.error(`❌ Failed to create job ${jobData.title}:`, error);
      }
    }

    console.log(`\n🎉 Database seeding completed successfully!`);
    console.log(`✅ Created ${createdUsers.length} users`);
    console.log(`✅ Created ${createdJobs.length} jobs`);
    
    // Log test user credentials
    console.log('\nTest Users Created:');
    console.log('-------------------');
    testUsers.forEach((user, index) => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Admin: ${user.isAdmin ? 'Yes' : 'No'}`);
      console.log(`Verified: ${user.isVerified ? 'Yes' : 'No'}`);
      console.log('-------------------');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();