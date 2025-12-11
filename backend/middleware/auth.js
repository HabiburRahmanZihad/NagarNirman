// Only allow superAdmin
export const superAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'superAdmin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super Admins only.'
    });
  }
  next();
};
// Authentication Middleware (Native MongoDB)
import jwt from 'jsonwebtoken';
import { getUserById } from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (without password)
      const user = await getUserById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated',
        });
      }

      // Attach user to request
      req.user = {
        _id: user._id,
        id: user._id.toString(),
        role: user.role,
        approved: user.approved,
        division: user.division || null,
      };

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// Check if user is approved (for problem solvers)
export const checkApproved = (req, res, next) => {
  if (req.user.role === 'problemSolver') {
    if (!req.user.approved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval',
      });
    }
  }
  next();
};
