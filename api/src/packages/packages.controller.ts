import { NextFunction, Request, Response } from "express";
import { getPackageByTrackingNumber } from "./packages.service";

export const getPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { trackingNumber } = req.params;
    const packageData = await getPackageByTrackingNumber(trackingNumber);
    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json(packageData);
  } catch (error) {
    next(error);
  }
};
