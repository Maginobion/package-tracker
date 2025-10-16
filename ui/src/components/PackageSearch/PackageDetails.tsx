import type { Package } from "@common/types/packages/package.types";

type PackageDetailsProps = {
  data: Package;
};

const PackageDetails = ({ data }: PackageDetailsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Package Details</h2>
      <div className="text-left">
        <p>Tracking number: {data.tracking_number}</p>
        <p>Status: {data.status}</p>
        <p>Shipped at: {data.shipped_at ?? "N/A"}</p>
        <p>Delivered at: {data.delivered_at ?? "N/A"}</p>
        <p>Destination address: {data.destination_address}</p>
        <p>Created at: {new Date(data.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default PackageDetails;
