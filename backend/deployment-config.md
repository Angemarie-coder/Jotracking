# Deployment Configuration Guide

## Environment Variables for Production

When deploying your app, update these environment variables:

### Backend Environment Variables (.env)
```bash
NODE_ENV=production
FRONTEND_URL=https://yourapp.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

### Email Configuration Updates

Update `backend/src/config/email-config.ts`:

```typescript
const emailConfig: EmailConfig = {
  EMAIL_USER: process.env.EMAIL_USER || 'your-email@gmail.com',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'your-app-password',
  EMAIL_FROM: process.env.EMAIL_FROM || 'your-email@gmail.com',
  
  // Environment-based frontend URL
  FRONTEND_URL: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://yourapp.com/verify-email'
    : 'jobtracker://verify-email'
};
```

## Email Verification Flow

### Local Development
- **Email link:** `jobtracker://verify-email?token=abc&email=user@example.com`
- **Opens:** Mobile app directly
- **Verification:** Handled by EmailVerificationScreen

### Production Deployment
- **Email link:** `https://yourapp.com/verify-email?token=abc&email=user@example.com`
- **Opens:** Web page or redirects to mobile app
- **Verification:** Handled by web endpoint or mobile app

## Mobile App Deep Link Handling

The mobile app will handle both:
1. **Direct deep links** (local development)
2. **Universal links** (production - if configured)

## Security Considerations

1. **HTTPS required** for production
2. **Environment variables** for sensitive data
3. **Token expiration** (24 hours)
4. **Email validation** before verification
