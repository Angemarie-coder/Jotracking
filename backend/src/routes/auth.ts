import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { Op } from 'sequelize';
import User from '../models/User.model';
import { verifyToken } from '../middleware/adminAuth';

interface JwtUserPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

const router = Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email });
    
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    // Find user in the database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      console.log('Email not verified:', email);
      return res.status(403).json({
        success: false,
        error: 'Please verify your email before logging in',
        requiresVerification: true,
        email: user.email
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id.toString(),
        email: user.email,
        isAdmin: Boolean(user.isAdmin)
      } as JwtUserPayload,
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: '7d' }
    );

    // Remove password from the response
    const { password: _, ...userWithoutPassword } = user.get({ plain: true });

    console.log('Login successful for user:', user.id);
    res.json({
      success: true,
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', { body: req.body });
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format');
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    console.log('Checking for existing user with email:', email);
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('Registration failed: User already exists');
      return res.status(409).json({ error: "User already exists" });
    }

    console.log('Hashing password...');
    // Hash password - Let the User model handle this with @BeforeCreate hook
    // const hashedPassword = await bcrypt.hash(password, 12);

    console.log('Creating user in database...');
    // Create user in the database
    const user = await User.create({
      firstName,
      lastName,
      email,
      password, // Let the User model hash this automatically
      isVerified: false, // User starts as unverified
    });

    // Generate verification token (valid for 24 hours)
    const verificationToken = require('crypto').randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);

    // Save verification token to user
    await user.update({
      verificationToken,
      verificationTokenExpires
    });

    // Send verification email
    try {
      const emailService = require('../services/email.service').default;
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
      
      await emailService.sendVerificationEmail({
        to: email,
        firstName,
        verificationUrl,
      });

      console.log('Verification email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails, but log the error
    }

    // Don't send sensitive data in response
    const { password: _, ...userWithoutPassword } = user.get({ plain: true });

    console.log('Registration successful for user:', userWithoutPassword.email);
    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
      error: "Registration failed",
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// Verify email endpoint
router.get('/verify-email', async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({ error: 'Missing token or email' });
    }

    // Find user by email and verification token
    const user = await User.findOne({
      where: {
        email,
        verificationToken: token,
        verificationTokenExpires: { [Op.gt]: new Date() } // Check if token is not expired
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification link' });
    }

    // Mark user as verified and clear verification token
    await user.update({
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null
    });

    // Redirect to login page with success message
    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
});

// Resend verification email endpoint
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // For security, don't reveal if the email exists or not
      return res.json({ 
        message: 'If your email is registered, you will receive a verification link' 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate new verification token (valid for 24 hours)
    const verificationToken = require('crypto').randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);

    // Update user with new verification token
    await user.update({
      verificationToken,
      verificationTokenExpires
    });

    // Send verification email
    try {
      const emailService = require('../services/email.service').default;
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
      
      await emailService.sendVerificationEmail({
        to: email,
        firstName: user.firstName,
        verificationUrl,
      });

      console.log('Verification email resent to:', email);
      res.json({ 
        message: 'Verification email resent. Please check your inbox.',
      });
    } catch (emailError) {
      console.error('Failed to resend verification email:', emailError);
      throw new Error('Failed to send verification email');
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification email';
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// Verify token endpoint
router.get('/verify', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk((req as any).user.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Verify endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk((req as any).user.userId, {
      attributes: { exclude: ['password'] } // Don't return the password
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
