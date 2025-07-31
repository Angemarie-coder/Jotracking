# Job Tracker Frontend

Next.js frontend application for the Job Tracker system.

## Features

- **Modern UI**: Built with Next.js 14, React 18, and Tailwind CSS
- **Component Library**: Radix UI components with custom styling
- **Authentication**: JWT-based login and registration
- **Job Management**: Create, read, update, and delete job applications
- **Responsive Design**: Mobile-first responsive design
- **Dark Mode**: Theme switching support

## Prerequisites

- Node.js 18+ 
- Backend server running on port 5000 (see `../backend/README.md`)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp env.local.example .env.local
```

3. Update `.env.local` with your backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main dashboard
├── components/         # Reusable UI components
├── lib/               # Utilities and API services
│   └── api.ts         # Backend API integration
├── hooks/             # Custom React hooks
└── public/            # Static assets
```

## API Integration

The frontend communicates with the backend through the API service layer (`lib/api.ts`):

- **Authentication**: Login/register with JWT tokens
- **Jobs**: CRUD operations for job applications
- **Auto-retry**: Automatic token refresh and error handling

## Default Test User

Use these credentials to test the application:
- Email: `john@example.com`
- Password: `password123`

## Development

- Uses TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for styling
- Radix UI for accessible components

## Deployment

1. Build the application: `npm run build`
2. Deploy the `out` folder to your hosting provider
3. Ensure the backend URL is correctly configured in environment variables
