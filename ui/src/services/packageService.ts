import type { PackageWithDetails } from "@common/types/packages/package.types";
import axiosClient from "../config/axios";

export const getPackage = async (
  trackingNumber: string,
  signal: AbortSignal
) => {
  const response = await axiosClient.get<PackageWithDetails>(
    `/packages/${trackingNumber}`,
    { signal }
  );
  return response.data;
};
