import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import Job, { JobStatus } from '../models/Job.model';
import User from '../models/User.model';
import { protect, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// Use the shared protect middleware instead of custom verifyToken

// Validation middleware for creating jobs
const validateJob = [
  check('title').trim().notEmpty().withMessage('Title is required'),
  check('company').trim().notEmpty().withMessage('Company is required'),
  check('status').optional().isIn(Object.values(JobStatus)).withMessage('Invalid status'),
  check('location').optional().trim(),
  check('description').optional().trim(),
  check('url').optional().trim().custom((value) => {
    if (value && value !== '' && !value.match(/^https?:\/\/.+/)) {
      throw new Error('URL must start with http:// or https://');
    }
    return true;
  }),
  check('salary').optional().trim(),
  check('notes').optional().trim(),
];

// Validation middleware for updating jobs (all fields optional)
const validateJobUpdate = [
  check('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  check('company').optional().trim().notEmpty().withMessage('Company cannot be empty'),
  check('status').optional().isIn(Object.values(JobStatus)).withMessage('Invalid status'),
  check('location').optional().trim(),
  check('description').optional().trim(),
  check('url').optional().trim().custom((value) => {
    if (value && value !== '' && !value.match(/^https?:\/\/.+/)) {
      throw new Error('URL must start with http:// or https://');
    }
    return true;
  }),
  check('salary').optional().trim(),
  check('notes').optional().trim(),
];

// GET /api/jobs - Get all jobs for the authenticated user with filtering and pagination
router.get('/', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;
    const search = req.query.search as string;
    const company = req.query.company as string;
    const location = req.query.location as string;

    // Build where clause
    const whereClause: any = { userId: req.user!.id };
    
    if (status && Object.values(JobStatus).includes(status as JobStatus)) {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { title: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { company: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { description: { [require('sequelize').Op.iLike]: `%${search}%` } },
      ];
    }
    
    if (company) {
      whereClause.company = { [require('sequelize').Op.iLike]: `%${company}%` };
    }
    
    if (location) {
      whereClause.location = { [require('sequelize').Op.iLike]: `%${location}%` };
    }

    const { count, rows: jobs } = await Job.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
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

// GET /api/jobs/stats - Get dashboard statistics
router.get('/stats', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await Job.findAll({
      where: { userId: req.user!.id },
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const totalJobs = await Job.count({
      where: { userId: req.user!.id }
    });

    const statsMap = {
      total: totalJobs,
      saved: 0,
      applied: 0,
      interviewing: 0,
      offer: 0,
      rejected: 0
    };

    stats.forEach((stat: any) => {
      if (stat.status && stat.count) {
        statsMap[stat.status as keyof typeof statsMap] = parseInt(stat.count);
      }
    });

    res.json({
      success: true,
      data: statsMap
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch statistics" 
    });
  }
});

// GET /api/jobs/:id - Get a single job by ID
router.get('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const job = await Job.findOne({
      where: { 
        id: req.params.id, 
        userId: req.user!.id
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
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
router.post('/', [protect, ...validateJob], async (req: AuthenticatedRequest, res: Response) => {
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
      userId: req.user!.id,
    });

    const createdJob = await Job.findByPk(job.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: createdJob
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
router.put('/:id', [protect, ...validateJobUpdate], async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const job = await Job.findOne({
      where: { 
        id: req.params.id, 
        userId: req.user!.id 
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found or not authorized"
      });
    }

    await job.update(req.body);
    
    const updatedJob = await Job.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

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
router.delete('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const job = await Job.findOne({
      where: { 
        id: req.params.id, 
        userId: req.user!.id 
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found or not authorized"
      });
    }

    await job.destroy();

    res.status(204).send();
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete job"
    });
  }
});

export default router;
