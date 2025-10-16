export type PackageProduct = {
  product_id: number;
  product_name: string;
  quantity: number;
  sku: string;
};

export type ShipmentHistory = {
  id: number;
  status: string;
  location: string | null;
  notes: string | null;
  event_timestamp: string;
  created_by_name: string | null;
  created_by_email: string | null;
};

export type Package = {
  created_at: string;
  delivered_at: string | null;
  destination_address: string;
  id: number;
  shipped_at: string | null;
  status: string;
  tracking_number: string;
  user_id: number;
};

export type PackageOverview = Package & {
  user_full_name: string;
  user_email: string;
  products: PackageProduct[];
};

export type PackageWithDetails = PackageOverview & {
  shipment_history: ShipmentHistory[];
};
