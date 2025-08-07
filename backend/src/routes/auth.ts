import express from 'express';
import { Router } from 'express';
import { registerUser, loginUser, getUserProfile, verifyEmail } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/adminAuth';

const router = Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email', verifyEmail);
router.get('/me', verifyToken, getUserProfile);

export default router;
