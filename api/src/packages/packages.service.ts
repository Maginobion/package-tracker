import type { Package } from "@common/types/packages/package.types";
import type Product from "@common/types/products/product.types";
import type { Sql } from "postgres";
import pgsql from "../config/database";
import { generateTrackingNumber } from "./packages.helper";

export const getPackageByTrackingNumber = async (trackingNumber: string) => {
  const [response]: Package[] = await pgsql`
    SELECT * FROM packages WHERE tracking_number = ${trackingNumber}
  `;
  return response as Package | undefined;
};

/**
 * Validates if a product is available for packaging
 * Locks the product row to prevent race conditions
 * @param sql - Transaction context
 * @param productId - ID of the product to check
 * @throws Error if product is not available
 */
const validateProductAvailability = async (
  sql: Sql,
  productId: number
): Promise<Product> => {
  const [product]: Product[] = await sql`
    SELECT * FROM products 
    WHERE id = ${productId} 
    AND NOT EXISTS (
      SELECT 1 FROM package_products WHERE product_id = ${productId}
    )
    FOR UPDATE  -- Lock the product row to prevent concurrent access
  `;

  if (!product) {
    throw new Error("Product is not available");
  }

  return product;
};

export const createPackage = async (
  productId: number,
  destinationAddress: string,
  userId: number,
  notes?: string
): Promise<Package> => {
  // Use a transaction to ensure atomicity and prevent race conditions
  return await pgsql.begin(async (sql) => {
    // Validate product availability within the transaction
    await validateProductAvailability(sql, productId);

    const trackingNumber = generateTrackingNumber();

    // Insert package
    const [response]: Package[] = await sql`
      INSERT INTO packages (tracking_number, user_id, destination_address, status, shipped_at, delivered_at) 
      VALUES (${trackingNumber}, ${userId}, ${destinationAddress}, 'pending', NULL, NULL)
      RETURNING *
    `;

    // Link product to package
    await sql`
      INSERT INTO package_products (package_id, product_id, quantity) 
      VALUES (${response.id}, ${productId}, 1)
    `;

    // Create shipment history
    await sql`
      INSERT INTO shipment_history (package_id, status, location, notes, event_timestamp) 
      VALUES (${response.id}, 'Label Created', ${destinationAddress}, ${notes ?? ""}, NOW())
    `;

    return response;
  });
};

export const setPackageReadyForShipping = async (
  packageId: number
): Promise<Package> => {
  return await pgsql.begin(async (sql) => {
    const [response]: Package[] = await sql`
      UPDATE packages SET status = 'ready_for_shipping' WHERE id = ${packageId}
      RETURNING *
    `;

    if (!response) {
      throw new Error("Package not found");
    }

    await sql`
      INSERT INTO shipment_history (package_id, status, location, notes, event_timestamp) 
      VALUES (${response.id}, 'Package Ready', ${response.destination_address}, 'Package packed and ready for pickup', NOW())
    `;

    return response;
  });
};

export const setPackageInTransit = async (
  packageId: number,
  location: string
): Promise<Package> => {
  return await pgsql.begin(async (sql) => {
    const [response]: Package[] = await sql`
      UPDATE packages SET status = 'in_transit', shipped_at = NOW() WHERE id = ${packageId}
      RETURNING *
    `;

    if (!response) {
      throw new Error("Package not found");
    }

    await sql`
      INSERT INTO shipment_history (package_id, status, location, notes, event_timestamp) 
      VALUES (${response.id}, 'In Transit', ${location}, 'Package is in transit', NOW())
    `;

    return response;
  });
};

export const setPackageDelivered = async (
  packageId: number
): Promise<Package> => {
  return await pgsql.begin(async (sql) => {
    const [response]: Package[] = await sql`
      UPDATE packages SET status = 'delivered', delivered_at = NOW() WHERE id = ${packageId}
      RETURNING *
    `;

    if (!response) {
      throw new Error("Package not found");
    }

    await sql`
      INSERT INTO shipment_history (package_id, status, location, notes, event_timestamp) 
      VALUES (${response.id}, 'Delivered', ${response.destination_address}, 'Successfully delivered to recipient', NOW())
    `;

    return response;
  });
};
