@echo off
REM Job Tracker Application Setup Script for Windows
REM This script will help you set up the entire project

echo 🚀 Setting up Job Tracker Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed. Please install PostgreSQL first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Backend Setup
echo 📦 Setting up backend...
cd backend

REM Install dependencies
echo Installing backend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy env.example .env
    echo ⚠️  Please edit the .env file with your database and email configuration
) else (
    echo ✅ .env file already exists
)

cd ..

REM Frontend Setup
echo 📱 Setting up frontend...
cd job-tracker-expo

REM Install dependencies
echo Installing frontend dependencies...
call npm install

cd ..

echo.
echo 🎉 Setup completed!
echo.
echo 📋 Next steps:
echo 1. Edit backend/.env with your database and email settings
echo 2. Create the database: createdb job_tracker
echo 3. Start the backend: cd backend ^&^& npm run dev
echo 4. Update the API URL in job-tracker-expo/src/config/environment.ts
echo 5. Start the frontend: cd job-tracker-expo ^&^& npm start
echo.
echo 📚 For detailed instructions, see README.md
pause 