import { z } from "zod";

// GET /api/packages/:trackingNumber
export const getPackageSchema = z.object({
  params: z.object({
    trackingNumber: z
      .string()
      .min(1, "Tracking number is required")
      .regex(
        /^(PKG-[A-Z]{2}-\d{4}-\d{3}|PKG-\d+-[A-Z0-9]+)$/,
        "Invalid tracking number format. Expected: PKG-XX-YYYY-NNN or PKG-{timestamp}-{code}"
      ),
  }),
});

// POST /api/packages
export const createPackageSchema = z.object({
  body: z.object({
    destinationAddress: z.string().min(1, "Destination address is required"),
    productId: z
      .number()
      .int()
      .positive("Product ID must be a positive integer"),
    notes: z.string().optional(),
  }),
});

export const setPackageReadyForShippingSchema = z.object({
  body: z.object({
    trackingNumber: z.string().min(1, "Tracking number is required"),
  }),
});

export const setPackageInTransitSchema = z.object({
  body: z.object({
    trackingNumber: z.string().min(1, "Tracking number is required"),
  }),
});

export const setPackageDeliveredSchema = z.object({
  body: z.object({
    trackingNumber: z.string().min(1, "Tracking number is required"),
  }),
});

export const setPackageReturnedToWarehouseSchema = z.object({
  body: z.object({
    trackingNumber: z.string().min(1, "Tracking number is required"),
  }),
});

// GET /api/packages (paginated)
export const getPackagesPaginatedSchema = z.object({
  query: z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().int().positive().max(100).default(20),

    startDate: z.iso.datetime().optional(),
    endDate: z.iso.datetime().optional(),

    status: z
      .enum(["pending", "ready_for_shipping", "in_transit", "delivered"])
      .optional(),

    // Returned to warehouse filter
    hasReturnedToWarehouse: z
      .enum(["true", "false"])
      .optional()
      .transform((val) =>
        val === "true" ? true : val === "false" ? false : undefined
      ),
  }),
});

export type GetPackageParams = z.infer<typeof getPackageSchema>["params"];
export type CreatePackageBody = z.infer<typeof createPackageSchema>["body"];
export type SetPackageReadyForShippingBody = z.infer<
  typeof setPackageReadyForShippingSchema
>["body"];
export type SetPackageInTransitBody = z.infer<
  typeof setPackageInTransitSchema
>["body"];
export type SetPackageDeliveredBody = z.infer<
  typeof setPackageDeliveredSchema
>["body"];
export type SetPackageReturnedToWarehouseBody = z.infer<
  typeof setPackageReturnedToWarehouseSchema
>["body"];
export type GetPackagesPaginatedQuery = z.infer<
  typeof getPackagesPaginatedSchema
>["query"];
