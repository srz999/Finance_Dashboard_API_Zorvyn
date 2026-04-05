const FinancialRecord = require('../models/FinancialRecord');

/**
 * @desc    Get dashboard summary
 * @route   GET /api/dashboard/summary
 * @access  Analyst, Admin
 */
const getSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = { user: req.userId, isDeleted: false };
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Get totals
    const [totals] = await FinancialRecord.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          totalExpenses: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalIncome: totals?.totalIncome || 0,
          totalExpenses: totals?.totalExpenses || 0,
          netBalance: (totals?.totalIncome || 0) - (totals?.totalExpenses || 0),
          totalRecords: totals?.count || 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get category-wise breakdown
 * @route   GET /api/dashboard/categories
 * @access  Analyst, Admin
 */
const getCategoryBreakdown = async (req, res, next) => {
  try {
    const { startDate, endDate, type } = req.query;

    const filter = { user: req.userId, isDeleted: false };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (type) filter.type = type;

    const categoryData = await FinancialRecord.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Transform for easier consumption
    const breakdown = {
      income: {},
      expense: {}
    };

    categoryData.forEach(item => {
      breakdown[item._id.type][item._id.category] = {
        total: item.total,
        count: item.count
      };
    });

    res.json({
      success: true,
      data: { breakdown }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recent activity
 * @route   GET /api/dashboard/recent
 * @access  Analyst, Admin
 */
const getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const records = await FinancialRecord.find({
      user: req.userId,
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('amount type category date description createdAt');

    res.json({
      success: true,
      data: { recentActivity: records }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get monthly trends
 * @route   GET /api/dashboard/trends
 * @access  Analyst, Admin
 */
const getTrends = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 6;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const trends = await FinancialRecord.aggregate([
      {
        $match: {
          user: req.userId,
          isDeleted: false,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          expenses: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          income: 1,
          expenses: 1,
          netIncome: { $subtract: ['$income', '$expenses'] },
          count: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: { trends }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get weekly breakdown
 * @route   GET /api/dashboard/weekly
 * @access  Analyst, Admin
 */
const getWeeklyBreakdown = async (req, res, next) => {
  try {
    const weeks = parseInt(req.query.weeks) || 4;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeks * 7));
    startDate.setHours(0, 0, 0, 0);

    const weeklyData = await FinancialRecord.aggregate([
      {
        $match: {
          user: req.userId,
          isDeleted: false,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $week: '$date' },
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          expenses: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          weekNumber: '$_id',
          income: 1,
          expenses: 1,
          netIncome: { $subtract: ['$income', '$expenses'] },
          count: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: { weeklyBreakdown: weeklyData }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getRecentActivity,
  getTrends,
  getWeeklyBreakdown
};