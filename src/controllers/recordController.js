const FinancialRecord = require('../models/FinancialRecord');

/**
 * @desc    Create a new financial record
 * @route   POST /api/records
 * @access  Analyst, Admin
 */
const createRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.create({
      ...req.body,
      user: req.userId
    });

    res.status(201).json({
      success: true,
      message: 'Financial record created successfully',
      data: { record }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all financial records for current user
 * @route   GET /api/records
 * @access  All authenticated users
 */
const getRecords = async (req, res, next) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = { user: req.userId, isDeleted: false };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const records = await FinancialRecord.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await FinancialRecord.countDocuments(filter);

    res.json({
      success: true,
      data: {
        records,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single financial record
 * @route   GET /api/records/:id
 * @access  All authenticated users
 */
const getRecordById = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      user: req.userId,
      isDeleted: false
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    res.json({
      success: true,
      data: { record }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update financial record
 * @route   PUT /api/records/:id
 * @access  Admin only
 */
const updateRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      user: req.userId,
      isDeleted: false
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    // Update fields
    const updates = ['amount', 'type', 'category', 'date', 'description'];
    updates.forEach(field => {
      if (req.body[field] !== undefined) {
        record[field] = req.body[field];
      }
    });

    await record.save();

    res.json({
      success: true,
      message: 'Record updated successfully',
      data: { record }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete financial record (soft delete)
 * @route   DELETE /api/records/:id
 * @access  Admin only
 */
const deleteRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      user: req.userId,
      isDeleted: false
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    // Soft delete
    record.isDeleted = true;
    await record.save();

    res.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
};