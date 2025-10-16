import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  getPackage,
  postCreatePackage,
  postSetPackageDelivered,
  postSetPackageInTransit,
  postSetPackageReadyForShipping,
} from "./packages.controller";
import {
  createPackageSchema,
  getPackageSchema,
  setPackageDeliveredSchema,
  setPackageInTransitSchema,
  setPackageReadyForShippingSchema,
} from "./packages.dto";

const router = Router();

router.get("/:trackingNumber", validateRequest(getPackageSchema), getPackage);

router.post(
  "/create",
  validateRequest(createPackageSchema),
  authenticate,
  requireRole(["warehouse_receiver"]),
  postCreatePackage
);
router.post(
  "/ready-for-shipping",
  validateRequest(setPackageReadyForShippingSchema),
  authenticate,
  requireRole(["warehouse_packer"]),
  postSetPackageReadyForShipping
);
router.post(
  "/in-transit",
  validateRequest(setPackageInTransitSchema),
  authenticate,
  requireRole(["carrier"]),
  postSetPackageInTransit
);
router.post(
  "/delivered",
  validateRequest(setPackageDeliveredSchema),
  authenticate,
  requireRole(["carrier"]),
  postSetPackageDelivered
);

export default router;
