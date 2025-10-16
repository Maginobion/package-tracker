import { NextFunction, Request, Response } from "express";

/**
 * Middleware to check if user has required role(s)
 * Must be used after authenticate middleware
 *
 * @param allowedRoles - Array of role names that are allowed to access the route
 * @returns Express middleware function
 *
 * @example
 * // Single role
 * router.post('/admin', authenticate, requireRole(['admin']), handler);
 *
 * @example
 * // Multiple roles (user must have at least one)
 * router.post('/warehouse', authenticate, requireRole(['warehouse_receiver', 'warehouse_packer']), handler);
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const userRoles = req.user.roles || [];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        message: "Insufficient permissions",
        required: allowedRoles,
        current: userRoles,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user has ALL required roles
 * Must be used after authenticate middleware
 *
 * @param requiredRoles - Array of role names that user must have ALL of
 * @returns Express middleware function
 *
 * @example
 * router.post('/special', authenticate, requireAllRoles(['admin', 'warehouse_manager']), handler);
 */
export const requireAllRoles = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const userRoles = req.user.roles || [];
    const hasAllRoles = requiredRoles.every((role) => userRoles.includes(role));

    if (!hasAllRoles) {
      return res.status(403).json({
        message: "Insufficient permissions - all roles required",
        required: requiredRoles,
        current: userRoles,
      });
    }

    next();
  };
};
