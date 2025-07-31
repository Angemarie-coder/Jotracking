import nodemailer from 'nodemailer';
import User from '../models/User.model';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';

class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@jobtracker.com';
    
    // For development, you can use Ethereal.email for testing
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || '',
      },
    });
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Job Tracker" <${this.fromEmail}>`,
        to,
        subject,
        html,
      });

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendVerificationEmail(user: User) {
    const verificationUrl = user.generateVerificationUrl(process.env.FRONTEND_URL || 'http://localhost:3000');
    
    // Read the email template
    const templatePath = path.join(__dirname, '../../templates/verification-email.ejs');
    const template = fs.readFileSync(templatePath, 'utf-8');
    
    // Render the template with user data
    const html = ejs.render(template, {
      name: `${user.firstName} ${user.lastName}`,
      verificationUrl,
      year: new Date().getFullYear(),
    });

    return this.sendEmail(
      user.email,
      'Verify Your Email - Job Tracker',
      html
    );
  }
}

export default new EmailService();
