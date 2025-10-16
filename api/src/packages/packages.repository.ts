import type { Package } from "@common/types/packages/package.types";
import type { Sql } from "postgres";

export interface IPackagesRepository {
  // Product validation
  findAvailableProduct(
    sql: Sql,
    productId: number
  ): Promise<{ available: boolean }>;

  // Package operations
  createPackage(
    sql: Sql,
    trackingNumber: string,
    userId: number,
    destinationAddress: string
  ): Promise<Package>;

  findPackageByIdForUpdate(
    sql: Sql,
    packageId: number
  ): Promise<Package | null>;

  updatePackageStatus(
    sql: Sql,
    packageId: number,
    currentStatus: string,
    newStatus: string,
    shippedAt?: Date,
    deliveredAt?: Date
  ): Promise<Package | null>;

  // Package products
  addPackageProduct(
    sql: Sql,
    packageId: number,
    productId: number,
    quantity: number
  ): Promise<void>;

  // Shipment history
  addShipmentHistory(
    sql: Sql,
    packageId: number,
    userId: number,
    status: string,
    location: string,
    notes: string
  ): Promise<void>;
}

export class PackagesRepository implements IPackagesRepository {
  findAvailableProduct = async (
    sql: Sql,
    productId: number
  ): Promise<{ available: boolean }> => {
    // Check if product exists and is not already in a package
    // Use FOR UPDATE to lock the row and prevent race conditions
    const products = await sql`
      SELECT * FROM products 
      WHERE id = ${productId} 
      AND NOT EXISTS (
        SELECT 1 FROM package_products WHERE product_id = ${productId}
      )
      FOR UPDATE
    `;
    return { available: products.length > 0 };
  };

  createPackage = async (
    sql: Sql,
    trackingNumber: string,
    userId: number,
    destinationAddress: string
  ): Promise<Package> => {
    const [response]: Package[] = await sql`
      INSERT INTO packages (tracking_number, user_id, destination_address, status, shipped_at, delivered_at) 
      VALUES (${trackingNumber}, ${userId}, ${destinationAddress}, 'pending', NULL, NULL)
      RETURNING *
    `;
    return response;
  };

  findPackageByIdForUpdate = async (
    sql: Sql,
    packageId: number
  ): Promise<Package | null> => {
    const packages = await sql<Package[]>`
      SELECT * FROM packages WHERE id = ${packageId} FOR UPDATE
    `;
    return packages.length > 0 ? packages[0] : null;
  };

  updatePackageStatus = async (
    sql: Sql,
    packageId: number,
    currentStatus: string,
    newStatus: string,
    shippedAt?: Date,
    deliveredAt?: Date
  ): Promise<Package | null> => {
    const updates: string[] = [`status = '${newStatus}'`];
    if (shippedAt !== undefined) {
      updates.push(
        `shipped_at = ${shippedAt ? `'${shippedAt.toISOString()}'` : "NULL"}`
      );
    }
    if (deliveredAt !== undefined) {
      updates.push(
        `delivered_at = ${deliveredAt ? `'${deliveredAt.toISOString()}'` : "NULL"}`
      );
    }

    const result = await sql<Package[]>`
      UPDATE packages 
      SET status = ${newStatus},
          shipped_at = ${shippedAt ?? sql`shipped_at`},
          delivered_at = ${deliveredAt ?? sql`delivered_at`}
      WHERE id = ${packageId} AND status = ${currentStatus}
      RETURNING *
    `;
    return result.length > 0 ? result[0] : null;
  };

  addPackageProduct = async (
    sql: Sql,
    packageId: number,
    productId: number,
    quantity: number
  ): Promise<void> => {
    await sql`
      INSERT INTO package_products (package_id, product_id, quantity) 
      VALUES (${packageId}, ${productId}, ${quantity})
    `;
  };

  addShipmentHistory = async (
    sql: Sql,
    packageId: number,
    userId: number,
    status: string,
    location: string,
    notes: string
  ): Promise<void> => {
    await sql`
      INSERT INTO shipment_history (package_id, user_id, status, location, notes, event_timestamp) 
      VALUES (${packageId}, ${userId}, ${status}, ${location}, ${notes}, NOW())
    `;
  };
}
