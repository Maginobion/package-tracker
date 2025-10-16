import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  getPackageByTrackingNumber,
  getPackagesPaginatedController,
  postCreatePackage,
  postSetPackageDelivered,
  postSetPackageInTransit,
  postSetPackageReadyForShipping,
  postSetPackageReturnedToWarehouse,
} from "./packages.controller";
import {
  createPackageSchema,
  getPackageSchema,
  getPackagesPaginatedSchema,
  setPackageDeliveredSchema,
  setPackageInTransitSchema,
  setPackageReadyForShippingSchema,
  setPackageReturnedToWarehouseSchema,
} from "./packages.dto";

const router = Router();

// Paginated list endpoint
router.get(
  "/",
  validateRequest(getPackagesPaginatedSchema),
  getPackagesPaginatedController
);

router.get(
  "/:trackingNumber",
  validateRequest(getPackageSchema),
  getPackageByTrackingNumber
);

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
router.post(
  "/returned-to-warehouse",
  validateRequest(setPackageReturnedToWarehouseSchema),
  authenticate,
  requireRole(["carrier"]),
  postSetPackageReturnedToWarehouse
);

export default router;
