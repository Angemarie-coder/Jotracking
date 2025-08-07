import express from 'express';
import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { registerUser, loginUser, getUserProfile, verifyEmail } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/adminAuth';

const router = Router();

// Validation middleware
const validateRegistration = [
  check('firstName').notEmpty().withMessage('First name is required'),
  check('lastName').notEmpty().withMessage('Last name is required'),
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password').notEmpty().withMessage('Password is required')
];

// Auth routes
router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/verify-email', verifyEmail);
router.get('/me', verifyToken, getUserProfile);

export default router;
