import type { PackageWithDetails } from "@common/types/packages/package.types";

type PackageDetailsProps = {
  data: PackageWithDetails;
};

const PackageDetails = ({ data }: PackageDetailsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Package Details</h2>
      <div className="text-left">
        <p>Tracking number: {data.tracking_number}</p>
        <p>Status: {data.status}</p>
        <p>
          User: {data.user_full_name} ({data.user_email})
        </p>
        <p>Shipped at: {data.shipped_at ?? "N/A"}</p>
        <p>Delivered at: {data.delivered_at ?? "N/A"}</p>
        <p>Destination address: {data.destination_address}</p>
        <p>Created at: {new Date(data.created_at).toLocaleString()}</p>
        <div className="mt-2">
          <h3 className="text-lg font-bold mb-2">Products</h3>
          <ul className="list-disc list-inside">
            {data.products.map((product) => (
              <li key={product.product_id}>
                {product.product_name} ({product.quantity})
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-2">
          <h3 className="text-lg font-bold mb-2">Shipment History</h3>
          <ul className="list-disc list-inside">
            {data.shipment_history.map((history) => (
              <li key={history.id} className="mb-1">
                {history.status} at {history.location} (
                {new Date(history.event_timestamp).toLocaleString()})
                {history.notes && <p>Notes: {history.notes}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
