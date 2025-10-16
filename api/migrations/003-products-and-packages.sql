-- Seed data for products and packages

-- Insert sample products for Chile Warehouse
INSERT INTO products (sku, warehouse_id, name, description) VALUES
    ('ELEC-001', 1, 'Wireless Headphones', 'Premium wireless headphones with noise cancellation'),
    ('ELEC-002', 1, 'Smartphone Case', 'Protective case for smartphones'),
    ('ELEC-003', 1, 'USB-C Cable', 'Fast charging USB-C cable'),
    ('BOOK-001', 1, 'Programming Guide', 'Complete guide to modern programming'),
    ('CLOTH-001', 1, 'Cotton T-Shirt', 'Premium cotton t-shirt'),
    ('HOME-001', 1, 'Coffee Mug', 'Ceramic coffee mug 350ml');

-- Insert sample products for Argentina Warehouse  
INSERT INTO products (sku, warehouse_id, name, description) VALUES
    ('ELEC-004', 2, 'Laptop Stand', 'Adjustable aluminum laptop stand'),
    ('ELEC-005', 2, 'Wireless Mouse', 'Ergonomic wireless mouse'),
    ('BOOK-002', 2, 'Design Principles', 'Modern design principles book'),
    ('CLOTH-002', 2, 'Hoodie', 'Comfortable cotton hoodie'),
    ('HOME-002', 2, 'Desk Lamp', 'LED desk lamp with adjustable brightness'),
    ('SPORT-001', 2, 'Yoga Mat', 'Non-slip yoga mat');

-- Insert sample packages with different statuses (all within 1 day delivery)
-- Package 1: Delivered package from Chile (completed same day)
INSERT INTO packages (user_id, tracking_number, destination_address, status, shipped_at, delivered_at, created_at) VALUES
    (3, 'PKG-CL-2024-001', 'Av. Libertador 1500, Santiago, Chile', 'delivered', 
     NOW() - INTERVAL '18 hours', NOW() - INTERVAL '10 hours', NOW() - INTERVAL '20 hours');

-- Package 2: In transit from Chile
INSERT INTO packages (user_id, tracking_number, destination_address, status, shipped_at, created_at) VALUES
    (3, 'PKG-CL-2024-002', 'Calle San Martín 2340, Valparaíso, Chile', 'in_transit',
     NOW() - INTERVAL '6 hours', NOW() - INTERVAL '8 hours');

-- Package 3: Ready for shipping from Argentina
INSERT INTO packages (user_id, tracking_number, destination_address, status, created_at) VALUES
    (3, 'PKG-AR-2024-001', 'Av. Corrientes 1234, Buenos Aires, Argentina', 'ready_for_shipping',
     NOW() - INTERVAL '5 hours');

-- Package 4: Pending from Argentina
INSERT INTO packages (user_id, tracking_number, destination_address, status, created_at) VALUES
    (3, 'PKG-AR-2024-002', 'Calle Florida 567, Córdoba, Argentina', 'pending',
     NOW() - INTERVAL '2 hours');

-- Package 5: In transit from Chile
INSERT INTO packages (user_id, tracking_number, destination_address, status, shipped_at, created_at) VALUES
    (3, 'PKG-CL-2024-003', 'Av. Brasil 3200, Concepción, Chile', 'in_transit',
     NOW() - INTERVAL '4 hours', NOW() - INTERVAL '7 hours');

-- Link products to packages (one product per package, quantity always 1)
INSERT INTO package_products (package_id, product_id, quantity) VALUES
    (1, 1, 1), -- Package 1: Wireless Headphones
    (2, 2, 1), -- Package 2: Smartphone Case
    (3, 7, 1), -- Package 3: Laptop Stand
    (4, 10, 1), -- Package 4: Hoodie
    (5, 4, 1); -- Package 5: Programming Guide

-- Add shipment history for tracking (all events within same day)
-- Package 1 history (delivered - full cycle within 10 hours)
-- User 2 (receiver) creates, User 3 (packer) packs, User 4 (carrier) delivers
INSERT INTO shipment_history (package_id, user_id, status, location, notes, event_timestamp) VALUES
    (1, 2, 'Label Created', 'Chile Warehouse, Santiago', 'Package created and label printed', NOW() - INTERVAL '20 hours'),
    (1, 3, 'Package Ready', 'Chile Warehouse, Santiago', 'Package packed and ready for pickup', NOW() - INTERVAL '19 hours'),
    (1, 4, 'Picked Up', 'Chile Warehouse, Santiago', 'Picked up by carrier', NOW() - INTERVAL '18 hours'),
    (1, 4, 'In Transit', 'Distribution Center, Santiago', 'Package in transit', NOW() - INTERVAL '14 hours'),
    (1, 4, 'Delivered', 'Av. Libertador 1500, Santiago', 'Successfully delivered to recipient', NOW() - INTERVAL '10 hours');

-- Package 2 history (in transit - currently in transit to Valparaíso)
INSERT INTO shipment_history (package_id, user_id, status, location, notes, event_timestamp) VALUES
    (2, 2, 'Label Created', 'Chile Warehouse, Santiago', 'Package created and label printed', NOW() - INTERVAL '8 hours'),
    (2, 3, 'Package Ready', 'Chile Warehouse, Santiago', 'Package packed and ready for pickup', NOW() - INTERVAL '7 hours'),
    (2, 4, 'Picked Up', 'Chile Warehouse, Santiago', 'Picked up by carrier', NOW() - INTERVAL '6 hours'),
    (2, 4, 'In Transit', 'Distribution Center, Santiago', 'Package in transit to Valparaíso', NOW() - INTERVAL '3 hours');

-- Package 3 history (ready for shipping)
INSERT INTO shipment_history (package_id, user_id, status, location, notes, event_timestamp) VALUES
    (3, 2, 'Label Created', 'Argentina Warehouse, Buenos Aires', 'Package created and label printed', NOW() - INTERVAL '5 hours'),
    (3, 3, 'Package Ready', 'Argentina Warehouse, Buenos Aires', 'Package packed and ready for pickup', NOW() - INTERVAL '3 hours');

-- Package 5 history (in transit - currently heading to Concepción)
INSERT INTO shipment_history (package_id, user_id, status, location, notes, event_timestamp) VALUES
    (5, 2, 'Label Created', 'Chile Warehouse, Santiago', 'Package created and label printed', NOW() - INTERVAL '7 hours'),
    (5, 3, 'Package Ready', 'Chile Warehouse, Santiago', 'Package packed and ready for pickup', NOW() - INTERVAL '6 hours'),
    (5, 4, 'Picked Up', 'Chile Warehouse, Santiago', 'Picked up by carrier', NOW() - INTERVAL '4 hours 30 minutes'),
    (5, 4, 'In Transit', 'Distribution Center, Santiago', 'Package in transit to Concepción', NOW() - INTERVAL '2 hours');
