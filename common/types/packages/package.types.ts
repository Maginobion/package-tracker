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
