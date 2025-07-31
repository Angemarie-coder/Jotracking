# Job Tracker Backend

Express.js backend API for the Job Tracker application.

## Features

- **Authentication**: JWT-based login and registration
- **Job Management**: CRUD operations for job applications
- **Security**: CORS, rate limiting, helmet protection
- **Mock Database**: In-memory storage (ready for database integration)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp env.example .env
```

3. Update `.env` with your values:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Jobs (Protected Routes)
- `GET /api/jobs` - Get user's jobs
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Health Check
- `GET /health` - Server health status

## Default Test User
- Email: `john@example.com`
- Password: `password123`

## Next Steps
- Replace mock database with real database (MongoDB, PostgreSQL, etc.)
- Add input validation with middleware
- Implement proper logging
- Add unit tests
