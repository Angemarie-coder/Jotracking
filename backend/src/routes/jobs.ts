import { Request, Response, NextFunction } from 'express';
import { request } from 'node:http';
const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Job = require('../models/Job');

// JWT verification middleware
function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false,
      error: "Unauthorized: No token provided" 
    });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    // Ensure the decoded token has the expected shape
    if (typeof decoded === 'string' || !('userId' in decoded)) {
      throw new Error('Invalid token structure');
    }
    
    req.user = decoded as { userId: string };
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      error: "Unauthorized: Invalid token" 
    });
  }
}

// Validation middleware
const validateJob = [
  check('title').trim().notEmpty().withMessage('Title is required'),
  check('company').trim().notEmpty().withMessage('Company is required'),
  check('status').isIn(['Applied', 'Interview', 'Offer', 'Rejected', 'Archived']).withMessage('Invalid status')
];

// GET /api/jobs - Get all jobs for the authenticated user with pagination
router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: jobs } = await Job.findAndCountAll({
      where: { userId: req.user!.userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total: count,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch jobs" 
    });
  }
});

// GET /api/jobs/:id - Get a single job by ID
router.get('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const job = await Job.findOne({
      where: { 
        id: req.params.id, 
        userId: req.user!.userId
      },
    });

    if (!job) {
      return res.status(404).json({ 
        success: false,
        error: "Job not found" 
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch job" 
    });
  }
});

// POST /api/jobs - Create a new job
router.post('/', [verifyToken, ...validateJob], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const job = await Job.create({
      ...req.body,
      userId: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create job"
    });
  }
});

// PUT /api/jobs/:id - Update a job
router.put('/:id', [verifyToken, ...validateJob], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const [updated] = await Job.update(req.body, {
      where: { 
        id: req.params.id, 
        userId: req.user!.userId 
      },
      returning: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Job not found or not authorized"
      });
    }

    const updatedJob = await Job.findByPk(req.params.id);
    
    res.json({
      success: true,
      data: updatedJob
    });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update job"
    });
  }
});

// DELETE /api/jobs/:id - Delete a job
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const deleted = await Job.destroy({
      where: { 
        id: req.params.id, 
        userId: req.user!.userId 
      },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Job not found or not authorized"
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete job"
    });
  }
});

module.exports = router;
