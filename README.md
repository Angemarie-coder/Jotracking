# Job Tracker Application

A comprehensive job tracking application built with React Native (Expo) frontend and Node.js/Express backend with TypeScript support.

## 🚀 Features

### Backend Features
- **User Authentication**: JWT-based authentication with email verification
- **Job Management**: Full CRUD operations for job applications
- **Advanced Filtering**: Search and filter jobs by status, company, location
- **Dashboard Statistics**: Real-time job application statistics
- **Admin Panel**: Admin user management and system monitoring
- **Email Integration**: Email verification and notifications
- **Database**: PostgreSQL with Sequelize ORM
- **API Documentation**: RESTful API with proper error handling

### Frontend Features
- **Cross-Platform**: React Native with Expo for iOS and Android
- **Modern UI**: Material Design with React Native Paper
- **Real-time Updates**: Live dashboard with pull-to-refresh
- **Advanced Search**: Search and filter jobs with pagination
- **Offline Support**: AsyncStorage for local data persistence
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Adaptive layout for different screen sizes

## 📱 Screenshots

*Add screenshots here once the app is running*

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with bcrypt
- **Email**: Nodemailer
- **Validation**: Express-validator
- **CORS**: Cross-origin resource sharing

### Frontend
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **UI Library**: React Native Paper (Material Design)
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Storage**: AsyncStorage
- **Icons**: Expo Vector Icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd job-tracker
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_tracker
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email (for verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Create database
createdb job_tracker

# Run migrations
npm run db:sync

# Seed database (optional)
npm run seed
```

### 4. Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The backend will be available at `http://localhost:5000`

### 5. Frontend Setup

```bash
cd ../job-tracker-expo

# Install dependencies
npm install
```

### 6. Configure API URL

Edit `src/config/environment.ts` and update the API base URL:

```typescript
// For development, use your computer's IP address
// Find your IP by running 'ipconfig' in Windows or 'ifconfig' in Mac/Linux
apiBaseUrl = 'http://YOUR_IP_ADDRESS:5000/api';
```

### 7. Start Frontend

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

## 📁 Project Structure

```
job-tracker/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Authentication and validation
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── migrations/         # Database migrations
│   └── templates/          # Email templates
├── job-tracker-expo/       # React Native frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── config/         # Environment configuration
│   │   ├── contexts/       # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── navigation/     # Navigation configuration
│   │   ├── screens/        # Screen components
│   │   ├── services/       # API services
│   │   ├── theme/          # UI theme configuration
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── assets/             # Images and static assets
```

## 🔧 Development

### Backend Development

```bash
cd backend

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Generate new migration
npx sequelize-cli migration:generate --name migration-name

# Run migrations
npm run db:sync
```

### Frontend Development

```bash
cd job-tracker-expo

# Start Expo development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web
```

### Environment Variables

#### Backend (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_tracker
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user information.

**Headers:**
```
Authorization: Bearer <token>
```

### Job Endpoints

#### GET /api/jobs
Get all jobs with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by job status
- `search` (string): Search in title, company, description
- `company` (string): Filter by company name
- `location` (string): Filter by location

#### GET /api/jobs/:id
Get a specific job by ID.

#### POST /api/jobs
Create a new job.

**Request Body:**
```json
{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "status": "applied",
  "description": "Job description...",
  "url": "https://example.com/job",
  "salary": "$100,000 - $150,000",
  "notes": "Personal notes..."
}
```

#### PUT /api/jobs/:id
Update an existing job.

#### DELETE /api/jobs/:id
Delete a job.

#### GET /api/jobs/stats
Get dashboard statistics.

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Frontend Testing

```bash
cd job-tracker-expo

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Backend Deployment

1. **Environment Setup**
   ```bash
   # Set production environment variables
   NODE_ENV=production
   PORT=5000
   ```

2. **Database Migration**
   ```bash
   npm run db:sync
   ```

3. **Build and Start**
   ```bash
   npm run build
   npm start
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   # Build for Android
   expo build:android

   # Build for iOS
   expo build:ios

   # Build for web
   expo build:web
   ```

2. **Publish to Expo**
   ```bash
   expo publish
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Changelog

### Version 1.0.0
- Initial release
- User authentication with JWT
- Job CRUD operations
- Dashboard with statistics
- Search and filtering
- Responsive design
- Error handling and validation

---

**Happy coding! 🎉** 