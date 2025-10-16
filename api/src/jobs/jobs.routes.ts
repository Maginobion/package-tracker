import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { getStalePackages, triggerStalePackagesJob } from "./jobs.controller";

const router = Router();

// GET /api/jobs/stale-packages - Get stale packages summary
// Requires authentication and admin role
router.get(
  "/stale-packages",
  authenticate,
  requireRole(["admin"]),
  getStalePackages
);

// POST /api/jobs/stale-packages/trigger - Manually trigger the job
// Requires authentication and admin role
router.post(
  "/stale-packages/trigger",
  authenticate,
  requireRole(["admin"]),
  triggerStalePackagesJob
);

export default router;
