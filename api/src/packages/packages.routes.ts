import { Router } from "express";
import { getPackage } from "./packages.controller";

const router = Router();

router.get("/:trackingNumber", getPackage);

export default router;
