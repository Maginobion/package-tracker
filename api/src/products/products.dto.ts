import { z } from "zod";

// GET /api/products/:sku
export const getProductSchema = z.object({
  params: z.object({
    sku: z
      .string()
      .min(1, "SKU is required")
      .regex(
        /^[A-Z]+-\d{3}$/,
        "Invalid SKU format. Expected format: CATEGORY-NNN (e.g., ELEC-001)"
      ),
  }),
});

// POST /api/products
export const createProductSchema = z.object({
  body: z.object({
    sku: z
      .string()
      .min(1, "SKU is required")
      .regex(
        /^[A-Z]+-\d{3}$/,
        "Invalid SKU format. Expected format: CATEGORY-NNN (e.g., ELEC-001)"
      ),
    name: z.string().min(1, "Product name is required").max(255),
    description: z.string().default(""),
    warehouseId: z
      .number()
      .int()
      .positive("Warehouse ID must be a positive integer"),
  }),
});

export type GetProductParams = z.infer<typeof getProductSchema>["params"];
export type CreateProductBody = z.infer<typeof createProductSchema>["body"];
