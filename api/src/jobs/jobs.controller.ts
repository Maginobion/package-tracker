import type { NextFunction, Request, Response } from "express";
import { checkStalePackagesJob } from "./stalePackages.job";
import { getStalePackagesSummary } from "./stalePackages.service";

export const getStalePackages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await getStalePackagesSummary();
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

/**
 * Manually trigger the stale packages check job
 */
export const triggerStalePackagesJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await checkStalePackagesJob();
    res.json({
      message: "Stale packages check completed",
      summary,
    });
  } catch (error) {
    next(error);
  }
};
