import type {
  Package,
  PackageOverview,
  PackageWithDetails,
  ShipmentHistory,
} from "@common/types/packages/package.types";
import type { Sql } from "postgres";
import pgsql from "../config/database";
import { generateTrackingNumber } from "./packages.helper";
import {
  PackagesRepository,
  type IPackagesRepository,
} from "./packages.repository";

// Default repository instance
const defaultRepository = new PackagesRepository();

export interface PaginatedPackagesResult {
  packages: PackageOverview[];
  nextCursor: string | null;
  hasMore: boolean;
}

export const getPackagesPaginated = async (
  cursor?: string,
  limit = 20,
  startDate?: string,
  endDate?: string,
  status?: string,
  hasReturnedToWarehouse?: boolean
): Promise<PaginatedPackagesResult> => {
  const conditions: string[] = [];

  if (cursor) {
    conditions.push(`p.id > ${parseInt(cursor, 10)}`);
  }

  if (startDate) {
    conditions.push(`p.created_at >= '${startDate}'`);
  }
  if (endDate) {
    conditions.push(`p.created_at <= '${endDate}'`);
  }

  if (status) {
    conditions.push(`p.status = '${status}'`);
  }

  // Returned to warehouse filter
  if (hasReturnedToWarehouse !== undefined) {
    const parsedHasReturnedToWarehouse =
      (hasReturnedToWarehouse as unknown as string) === "true" ? true : false;
    if (parsedHasReturnedToWarehouse) {
      conditions.push(`
        EXISTS (
          SELECT 1 FROM shipment_history sh 
          WHERE sh.package_id = p.id 
          AND sh.status = 'Returned to Warehouse'
        )
      `);
    } else {
      conditions.push(`
        NOT EXISTS (
          SELECT 1 FROM shipment_history sh 
          WHERE sh.package_id = p.id 
          AND sh.status = 'Returned to Warehouse'
        )
      `);
    }
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  console.log("whereClause", whereClause);

  // Fetch limit + 1 to check if there are more results
  const packages = await pgsql<PackageOverview[]>`
    SELECT 
      p.*,
      CONCAT(u.first_name, ' ', u.last_name) as user_full_name,
      u.email as user_email,
      COALESCE(
        json_agg(
          CASE 
            WHEN pr.id IS NOT NULL THEN
              json_build_object(
                'product_id', pr.id,
                'product_name', pr.name,
                'quantity', pp.quantity,
                'sku', pr.sku
              )
            ELSE NULL
          END
        ) FILTER (WHERE pr.id IS NOT NULL),
        '[]'
      ) as products
    FROM packages p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN package_products pp ON p.id = pp.package_id
    LEFT JOIN products pr ON pp.product_id = pr.id
    ${pgsql.unsafe(whereClause)}
    GROUP BY p.id, u.first_name, u.last_name, u.email
    ORDER BY p.id ASC
    LIMIT ${limit + 1}
  `;

  // Check if there are more results
  const hasMore = packages.length > limit;
  const resultPackages = hasMore ? packages.slice(0, limit) : packages;
  const nextCursor =
    hasMore && resultPackages.length > 0
      ? String(resultPackages[resultPackages.length - 1].id)
      : null;

  return {
    packages: resultPackages,
    nextCursor,
    hasMore,
  };
};

export const getPackageDetailsByTrackingNumber = async (
  trackingNumber: string
): Promise<PackageWithDetails | undefined> => {
  // Get package with user and product information
  const [packageData] = await pgsql<PackageOverview[]>`
    SELECT 
      p.*,
      CONCAT(u.first_name, ' ', u.last_name) as user_full_name,
      u.email as user_email,
      json_agg(
        json_build_object(
          'product_id', pr.id,
          'product_name', pr.name,
          'quantity', pp.quantity,
          'sku', pr.sku
        )
      ) as products
    FROM packages p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN package_products pp ON p.id = pp.package_id
    LEFT JOIN products pr ON pp.product_id = pr.id
    WHERE p.tracking_number = ${trackingNumber}
    GROUP BY p.id, u.first_name, u.last_name, u.email
  `;

  if (!packageData) {
    return undefined;
  }

  // Get shipment history ordered by timestamp
  const shipmentHistory = await pgsql<ShipmentHistory[]>`
    SELECT 
      sh.id,
      sh.status,
      sh.location,
      sh.notes,
      sh.event_timestamp,
      CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
      u.email as created_by_email
    FROM shipment_history sh
    LEFT JOIN users u ON sh.user_id = u.id
    WHERE sh.package_id = ${packageData.id}
    ORDER BY sh.event_timestamp DESC
  `;

  return {
    ...packageData,
    shipment_history: shipmentHistory,
  } as PackageWithDetails;
};

/**
 * Validates if a product is available for packaging
 * @param repository - Repository instance (injected for testing)
 * @param sql - Transaction context
 * @param productId - ID of the product to check
 * @throws Error if product is not available
 */
const validateProductAvailability = async (
  repository: IPackagesRepository,
  sql: Sql,
  productId: number
): Promise<void> => {
  const { available } = await repository.findAvailableProduct(sql, productId);
  if (!available) {
    throw new Error("Product is not available");
  }
};

export const createPackage = async (
  productId: number,
  destinationAddress: string,
  userId: number,
  notes?: string,
  repository: IPackagesRepository = defaultRepository
): Promise<Package> => {
  return await pgsql.begin(async (sql) => {
    await validateProductAvailability(repository, sql, productId);

    const trackingNumber = generateTrackingNumber();
    const newPackage = await repository.createPackage(
      sql,
      trackingNumber,
      userId,
      destinationAddress
    );

    await repository.addPackageProduct(sql, newPackage.id, productId, 1);
    await repository.addShipmentHistory(
      sql,
      newPackage.id,
      userId,
      "Label Created",
      destinationAddress,
      notes ?? "Package created and label printed"
    );

    return newPackage;
  });
};

export const setPackageReadyForShipping = async (
  trackingNumber: string,
  userId: number,
  repository: IPackagesRepository = defaultRepository
): Promise<Package> => {
  return await pgsql.begin(async (sql) => {
    // Find package first
    const [pkg]: Package[] = await sql`
      SELECT * FROM packages WHERE tracking_number = ${trackingNumber} FOR UPDATE
    `;

    if (!pkg) {
      throw new Error("Package not found");
    }

    const updatedPackage = await repository.updatePackageStatus(
      sql,
      pkg.id,
      "pending",
      "ready_for_shipping"
    );

    if (!updatedPackage) {
      throw new Error(
        "Package cannot be marked as ready - it must be in pending status"
      );
    }

    await repository.addShipmentHistory(
      sql,
      updatedPackage.id,
      userId,
      "Package Ready",
      updatedPackage.destination_address,
      "Package packed and ready for pickup"
    );

    return updatedPackage;
  });
};

export const setPackageInTransit = async (
  trackingNumber: string,
  userId: number,
  repository: IPackagesRepository = defaultRepository
): Promise<Package> => {
  return await pgsql.begin(async (sql) => {
    const [pkg]: Package[] = await sql`
      SELECT * FROM packages WHERE tracking_number = ${trackingNumber} FOR UPDATE
    `;

    if (!pkg) {
      throw new Error("Package not found");
    }

    const updatedPackage = await repository.updatePackageStatus(
      sql,
      pkg.id,
      "ready_for_shipping",
      "in_transit",
      new Date()
    );

    if (!updatedPackage) {
      throw new Error(
        "Package cannot be marked as in transit - it must be in ready_for_shipping status"
      );
    }

    await repository.addShipmentHistory(
      sql,
      updatedPackage.id,
      userId,
      "Picked Up",
      updatedPackage.destination_address,
      "Picked up by carrier"
    );
    await repository.addShipmentHistory(
      sql,
      updatedPackage.id,
      userId,
      "In Transit",
      updatedPackage.destination_address,
      "Package is in transit"
    );

    return updatedPackage;
  });
};

export const setPackageDelivered = async (
  trackingNumber: string,
  userId: number,
  repository: IPackagesRepository = defaultRepository
): Promise<Package> => {
  return await pgsql.begin(async (sql) => {
    const [pkg]: Package[] = await sql`
      SELECT * FROM packages WHERE tracking_number = ${trackingNumber} FOR UPDATE
    `;

    if (!pkg) {
      throw new Error("Package not found");
    }

    const updatedPackage = await repository.updatePackageStatus(
      sql,
      pkg.id,
      "in_transit",
      "delivered",
      undefined,
      new Date()
    );

    if (!updatedPackage) {
      throw new Error(
        "Package cannot be marked as delivered - it must be in in_transit status"
      );
    }

    await repository.addShipmentHistory(
      sql,
      updatedPackage.id,
      userId,
      "Delivered",
      updatedPackage.destination_address,
      "Successfully delivered to recipient"
    );

    return updatedPackage;
  });
};

export const setPackageReturnedToWarehouse = async (
  trackingNumber: string,
  userId: number,
  repository: IPackagesRepository = defaultRepository
): Promise<Package> => {
  return await pgsql.begin(async (sql) => {
    const [pkg]: Package[] = await sql`
      SELECT * FROM packages WHERE tracking_number = ${trackingNumber} FOR UPDATE
    `;

    if (!pkg) {
      throw new Error("Package not found");
    }

    const updatedPackage = await repository.updatePackageStatus(
      sql,
      pkg.id,
      "in_transit",
      "ready_for_shipping"
    );

    if (!updatedPackage) {
      throw new Error(
        "Package cannot be returned to warehouse - it must be in in_transit status"
      );
    }

    await repository.addShipmentHistory(
      sql,
      updatedPackage.id,
      userId,
      "Returned to Warehouse",
      updatedPackage.destination_address,
      "Package returned to warehouse"
    );

    return updatedPackage;
  });
};
