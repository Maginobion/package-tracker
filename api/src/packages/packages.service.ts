import type { Package } from "@common/types/packages/package.types";
import pgsql from "../config/database";

export const getPackageByTrackingNumber = async (trackingNumber: string) => {
  const [response]: Package[] = await pgsql`
    SELECT * FROM packages WHERE tracking_number = ${trackingNumber}
  `;
  return response as Package | undefined;
};
