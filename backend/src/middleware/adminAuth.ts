import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define the user payload that will be stored in the JWT
export interface JwtUserPayload extends JwtPayload {
  userId: string;  // Keep as string for JWT compatibility
  email: string;
  isAdmin: boolean;
}

// Extend the Express Request type with our user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number; 
        email: string;
        isAdmin: boolean;
      };
    }
  }
}

/**
 * Middleware to verify if the user is an admin
 * Must be used after the verifyToken middleware
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is set on the request (should be set by verifyToken)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    // User is admin, proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during admin authentication'
    });
  }
};

/**
 * Middleware to verify JWT token and attach user to request
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    // Verify token and type assertion
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JwtUserPayload;

    // Convert userId from string (JWT) to number (database)
    const userId = parseInt(decoded.userId, 10);
    if (isNaN(userId)) {
      throw new Error('Invalid user ID in token');
    }

    // Attach user to the request object with correct types
    req.user = {
      userId: userId,  // Now a number
      email: decoded.email,
      isAdmin: Boolean(decoded.isAdmin)
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token.'
    });
  }
};