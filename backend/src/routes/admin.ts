import express from 'express';
import { verifyToken, isAdmin } from '../middleware/adminAuth';
import User from '../models/User.model';
import { Op } from 'sequelize';

const router = express.Router();

// Apply verifyToken and isAdmin middleware to all routes in this router
router.use(verifyToken);
router.use(isAdmin);

/**
 * @route GET /api/admin/users
 * @desc Get all users (admin only)
 * @access Private/Admin
 */
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: users } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { email: { [Op.iLike]: `%${search}%` } },
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } }
        ]
      },
      attributes: { exclude: ['password'] },
      limit: Number(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: users,
      pagination: {
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching users'
    });
  }
});

/**
 * @route PUT /api/admin/users/:id/toggle-admin
 * @desc Toggle admin status for a user (admin only)
 * @access Private/Admin
 */
router.put('/users/:id/toggle-admin', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent modifying your own admin status
    if (Number(id) === req.user?.userId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot modify your own admin status'
      });
    }

    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Toggle admin status
    await user.update({ isAdmin: !user.isAdmin });

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error toggling admin status:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating user'
    });
  }
});

export default router;