import { NextFunction, Request, Response } from "express";
import { CreateProductBody, GetProductParams } from "./products.dto";
import { createProduct, getProductBySku } from "./products.service";

export const getProduct = async (
  req: Request<GetProductParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sku } = req.params;
    const product = await getProductBySku(sku);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const postCreateProduct = async (
  req: Request<object, object, CreateProductBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sku, name, description, warehouseId } = req.body;
    const product = await createProduct(sku, warehouseId, name, description);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};
