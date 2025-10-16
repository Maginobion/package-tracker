import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { getProduct, postCreateProduct } from "./products.controller";
import { createProductSchema, getProductSchema } from "./products.dto";

const router = Router();

router.get("/:sku", validateRequest(getProductSchema), getProduct);
router.post("/", validateRequest(createProductSchema), postCreateProduct);

export default router;
