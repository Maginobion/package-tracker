import Product from "@common/types/products/product.types";
import pgsql from "../config/database";

export const getProductBySku = async (sku: string) => {
  const response: Product[] = await pgsql`
    SELECT * FROM products WHERE sku = ${sku}
  `;
  return response;
};

export const createProduct = async (
  sku: string,
  warehouseId: number,
  name: string,
  description: string
) => {
  const [response]: Product[] = await pgsql`
    INSERT INTO products (sku, warehouse_id, name, description) VALUES (${sku}, ${warehouseId}, ${name}, ${description})
    RETURNING *
  `;
  return response as Product | undefined;
};
