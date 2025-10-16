import type { Package } from "@common/types/packages/package.types";
import pgsql from "../config/database";

/**
 * Find packages that:
 * 1. Pending packages: created more than 3 days ago (never left pending)
 * 2. Ready_for_shipping: the latest return to warehouse was more than 3 days ago
 */
export const findPackagesNotInTransit = async (): Promise<Package[]> => {
  const packages = await pgsql<Package[]>`
    SELECT DISTINCT p.* FROM packages p
    WHERE (
      -- Pending packages > 3 days
      (p.status = 'pending'
       AND p.created_at < NOW() - INTERVAL '3 days')
      OR
      -- Ready_for_shipping packages where the LATEST return was > 3 days ago
      (p.status = 'ready_for_shipping'
       AND (
         SELECT MAX(sh.event_timestamp)
         FROM shipment_history sh
         WHERE sh.package_id = p.id
         AND sh.status = 'Returned to Warehouse'
       ) < NOW() - INTERVAL '3 days')
    )
    ORDER BY p.created_at ASC
  `;

  return packages;
};

/**
 * Find packages that were:
 * 1. Put in transit on a given day
 * 2. Returned to warehouse the same day
 * 3. Still not delivered
 */
export const findSameDayReturnedPackages = async (): Promise<Package[]> => {
  const packages = await pgsql<Package[]>`
    SELECT DISTINCT p.* FROM packages p
    WHERE p.status = 'ready_for_shipping'
    AND p.delivered_at IS NULL
    AND p.shipped_at IS NOT NULL
    AND EXISTS (
      -- Check if package was marked as in_transit
      SELECT 1 FROM shipment_history sh_transit
      WHERE sh_transit.package_id = p.id
      AND sh_transit.status = 'In Transit'
    )
    AND EXISTS (
      -- Check if package was returned to warehouse the same day it went in transit
      SELECT 1 FROM shipment_history sh_transit, shipment_history sh_returned
      WHERE sh_transit.package_id = p.id
      AND sh_returned.package_id = p.id
      AND sh_transit.status = 'In Transit'
      AND sh_returned.status = 'Returned to Warehouse'
      AND DATE(sh_transit.event_timestamp) = DATE(sh_returned.event_timestamp)
    )
    ORDER BY p.created_at ASC
  `;

  return packages;
};

export const getStalePackagesSummary = async () => {
  const notInTransit = await findPackagesNotInTransit();
  const sameDayReturned = await findSameDayReturnedPackages();

  return {
    notInTransit: {
      count: notInTransit.length,
      packages: notInTransit,
      description: "Not shipped or in transit for more than 3 days",
    },
    sameDayReturned: {
      count: sameDayReturned.length,
      packages: sameDayReturned,
      description: "Returned same day and still not delivered",
    },
    total: notInTransit.length + sameDayReturned.length,
  };
};
