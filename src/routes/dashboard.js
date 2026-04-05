const express = require('express');
const router = express.Router();
const {
  getSummary,
  getCategoryBreakdown,
  getRecentActivity,
  getTrends,
  getWeeklyBreakdown
} = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');
const { canViewAnalytics } = require('../middleware/rbac');

// All routes require authentication and analyst/admin role
router.use(authenticate);
router.use(canViewAnalytics);

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Dashboard summary
 */
router.get('/summary', getSummary);

/**
 * @swagger
 * /api/dashboard/categories:
 *   get:
 *     summary: Get category-wise breakdown
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category breakdown
 */
router.get('/categories', getCategoryBreakdown);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get recent activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recent activity
 */
router.get('/recent', getRecentActivity);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Monthly trends
 */
router.get('/trends', getTrends);

/**
 * @swagger
 * /api/dashboard/weekly:
 *   get:
 *     summary: Get weekly breakdown
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: weeks
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Weekly breakdown
 */
router.get('/weekly', getWeeklyBreakdown);

module.exports = router;