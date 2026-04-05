/**
 * Role-Based Access Control (RBAC) Middleware
 *
 * Roles:
 * - viewer: Can only view dashboard data (read-only)
 * - analyst: Can view records and access insights (read + analytics)
 * - admin: Full access (create, read, update, delete + user management)
 */

/**
 * Middleware to check if user has required role(s)
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      });
    }

    next();
  };
};

/**
 * Middleware to check if user can create records
 * Allowed: analyst, admin
 */
const canCreate = authorize('analyst', 'admin');

/**
 * Middleware to check if user can update records
 * Allowed: admin
 */
const canUpdate = authorize('admin');

/**
 * Middleware to check if user can delete records
 * Allowed: admin
 */
const canDelete = authorize('admin');

/**
 * Middleware to check if user can manage users
 * Allowed: admin only
 */
const canManageUsers = authorize('admin');

/**
 * Middleware to check if user can view analytics
 * Allowed: analyst, admin
 */
const canViewAnalytics = authorize('analyst', 'admin');

module.exports = {
  authorize,
  canCreate,
  canUpdate,
  canDelete,
  canManageUsers,
  canViewAnalytics
};