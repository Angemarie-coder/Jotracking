import nodemailer from 'nodemailer';
import User from '../models/User.model';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import emailConfig from '../config/email-config';

class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;

  constructor() {
    this.fromEmail = emailConfig.EMAIL_FROM;
    
    // Configure Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailConfig.EMAIL_USER,
        pass: emailConfig.EMAIL_PASSWORD,
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
    const verificationUrl = user.generateVerificationUrl(emailConfig.FRONTEND_URL);
    
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
