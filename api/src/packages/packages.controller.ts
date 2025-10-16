import { NextFunction, Request, Response } from "express";
import {
  CreatePackageBody,
  GetPackageParams,
  SetPackageDeliveredBody,
  SetPackageInTransitBody,
  SetPackageReadyForShippingBody,
} from "./packages.dto";
import {
  createPackage,
  getPackageByTrackingNumber,
  setPackageDelivered,
  setPackageInTransit,
  setPackageReadyForShipping,
} from "./packages.service";

export const getPackage = async (
  req: Request<GetPackageParams>,
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

export const postCreatePackage = async (
  req: Request<object, object, CreatePackageBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { destinationAddress, productId } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.userId;
    const packageEntity = await createPackage(
      productId,
      destinationAddress,
      userId
    );
    res.status(201).json(packageEntity);
  } catch (error) {
    next(error);
  }
};

export const postSetPackageReadyForShipping = async (
  req: Request<object, object, SetPackageReadyForShippingBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { packageId } = req.body;
    const packageEntity = await setPackageReadyForShipping(packageId);
    res.status(200).json(packageEntity);
  } catch (error) {
    next(error);
  }
};

export const postSetPackageInTransit = async (
  req: Request<object, object, SetPackageInTransitBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { packageId, location } = req.body;
    const packageEntity = await setPackageInTransit(packageId, location);
    res.status(200).json(packageEntity);
  } catch (error) {
    next(error);
  }
};

export const postSetPackageDelivered = async (
  req: Request<object, object, SetPackageDeliveredBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { packageId } = req.body;
    const packageEntity = await setPackageDelivered(packageId);
    res.status(200).json(packageEntity);
  } catch (error) {
    next(error);
  }
};
