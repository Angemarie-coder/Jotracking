#!/bin/bash

# Job Tracker Application Setup Script
# This script will help you set up the entire project

echo "🚀 Setting up Job Tracker Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Backend Setup
echo "📦 Setting up backend..."
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit the .env file with your database and email configuration"
else
    echo "✅ .env file already exists"
fi

cd ..

# Frontend Setup
echo "📱 Setting up frontend..."
cd job-tracker-expo

# Install dependencies
echo "Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your database and email settings"
echo "2. Create the database: createdb job_tracker"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Update the API URL in job-tracker-expo/src/config/environment.ts"
echo "5. Start the frontend: cd job-tracker-expo && npm start"
echo ""
echo "📚 For detailed instructions, see README.md" 