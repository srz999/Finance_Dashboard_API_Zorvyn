const express = require('express');
const router = express.Router();
const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
} = require('../controllers/recordController');
const { authenticate } = require('../middleware/auth');
const { canCreate, canUpdate, canDelete } = require('../middleware/rbac');
const { validate, recordSchemas } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all financial records
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of financial records
 */
router.get('/', validate(recordSchemas.query, 'query'), getRecords);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get single financial record
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record details
 *       404:
 *         description: Record not found
 */
router.get('/:id', getRecordById);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new financial record
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Record created
 *       403:
 *         description: Access denied
 */
router.post('/', canCreate, validate(recordSchemas.create), createRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     summary: Update financial record
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated
 *       403:
 *         description: Access denied
 *       404:
 *         description: Record not found
 */
router.put('/:id', canUpdate, validate(recordSchemas.update), updateRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Delete financial record
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted
 *       403:
 *         description: Access denied
 *       404:
 *         description: Record not found
 */
router.delete('/:id', canDelete, deleteRecord);

module.exports = router;