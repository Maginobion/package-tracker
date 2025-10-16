import { z } from "zod";

// GET /api/packages/:trackingNumber
export const getPackageSchema = z.object({
  params: z.object({
    trackingNumber: z
      .string()
      .min(1, "Tracking number is required")
      .regex(
        /^PKG-[A-Z]{2}-\d{4}-\d{3}$/,
        "Invalid tracking number format. Expected format: PKG-XX-YYYY-NNN"
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
