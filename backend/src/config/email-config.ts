// Email Configuration for Gmail
// Replace these values with your actual Gmail credentials

interface EmailConfig {
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  EMAIL_FROM: string;
  FRONTEND_URL: string;
}

const emailConfig: EmailConfig = {
  // Your Gmail address
  EMAIL_USER: process.env.EMAIL_USER || 'uwineza.angemarie@gmail.com',
  
  // Your Gmail App Password (not your regular password)
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'panh psgz rypk zkto',
  
  // From email address
  EMAIL_FROM: process.env.EMAIL_FROM || 'uwineza.angemarie@gmail.com',
  
  // Frontend URL for verification links (environment-based)
  FRONTEND_URL: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://yourapp.com/verify-email'  // Replace with your actual domain
    : 'http://192.168.1.124:5000/verify-email'  // Web verification page for local development
};

// Instructions for setting up Gmail App Password:
// 1. Go to your Google Account settings
// 2. Enable 2-Step Verification if not already enabled
// 3. Go to Security > App passwords
// 4. Generate a new app password for "Mail"
// 5. Use that 16-character password here (not your regular Gmail password)

export default emailConfig;
