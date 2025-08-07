import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { sequelize } from '../config/data-source';
import User from "../models/User.model"
import { generateToken } from '../utils/jwt';
import emailService from '../services/email.service';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        error: 'User already exists' 
      });
    }

    // Create user using Sequelize's create method
    const user = await User.create({
      firstName,
      lastName,
      email,
      password, // Password will be hashed by the @BeforeCreate hook in the model
      isVerified: false // User starts as unverified
    });

    // Send verification email
    try {
      await emailService.sendVerificationEmail(user);
      console.log('Verification email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isVerified: user.isVerified,
        },
        message: 'Registration successful. Please check your email to verify your account.'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error' 
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'firstName', 'lastName', 'email', 'password', 'isVerified']
    });

    if (user) {
      const isPasswordValid = await user.validatePassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid email or password' 
        });
      }
      
      if (!user.isVerified) {
        return res.status(403).json({ 
          success: false,
          error: 'Please verify your email before logging in',
          isVerified: false
        });
      }
      
      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isVerified: user.isVerified,
          },
          token: generateToken({ id: user.id.toString(), email: user.email }),
        }
      });
    } else {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error' 
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findOne({ where: { id: req.user.userId } });
    
    if (user) {
      res.json({
        success: true,
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin,
        }
      });
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error' 
    });
  }
};

// @desc    Verify email address
// @route   GET /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing token or email' 
      });
    }

    // Find user by email and verification token
    const user = await User.findOne({
      where: {
        email: email as string,
        verificationToken: token as string,
        verificationTokenExpires: { [require('sequelize').Op.gt]: new Date() } // Check if token is not expired
      }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid or expired verification link' 
      });
    }

    // Mark user as verified and clear verification token
    await user.update({
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null
    });

    // Return JSON response for web verification page
    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to verify email' 
    });
  }
};