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

-- Package 6: Delivered from Argentina (older - 5 days ago)
INSERT INTO packages (user_id, tracking_number, destination_address, status, shipped_at, delivered_at, created_at) VALUES
    (3, 'PKG-AR-2024-003', 'Av. Santa Fe 890, Rosario, Argentina', 'delivered',
     NOW() - INTERVAL '5 days' - INTERVAL '2 hours', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' - INTERVAL '4 hours');

-- Package 7: Pending (old - 4 days ago)
INSERT INTO packages (user_id, tracking_number, destination_address, status, created_at) VALUES
    (3, 'PKG-CL-2024-004', 'Calle O''Higgins 456, Antofagasta, Chile', 'pending',
     NOW() - INTERVAL '4 days');

-- Package 8: Ready for shipping (3 days ago)
INSERT INTO packages (user_id, tracking_number, destination_address, status, created_at) VALUES
    (3, 'PKG-AR-2024-004', 'Av. Rivadavia 2100, Mendoza, Argentina', 'ready_for_shipping',
     NOW() - INTERVAL '3 days');

-- Package 9: Delivered (2 days ago)
INSERT INTO packages (user_id, tracking_number, destination_address, status, shipped_at, delivered_at, created_at) VALUES
    (3, 'PKG-CL-2024-005', 'Av. Alemania 600, Temuco, Chile', 'delivered',
     NOW() - INTERVAL '2 days' - INTERVAL '4 hours', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' - INTERVAL '6 hours');

-- Package 10: In transit (1 day ago)
INSERT INTO packages (user_id, tracking_number, destination_address, status, shipped_at, created_at) VALUES
    (3, 'PKG-AR-2024-005', 'Calle Belgrano 780, La Plata, Argentina', 'in_transit',
     NOW() - INTERVAL '1 day' - INTERVAL '3 hours', NOW() - INTERVAL '1 day' - INTERVAL '5 hours');

-- Package 11-15: More recent packages (last 12 hours)
INSERT INTO packages (user_id, tracking_number, destination_address, status, shipped_at, delivered_at, created_at) VALUES
    (3, 'PKG-CL-2024-006', 'Av. Providencia 1234, Santiago, Chile', 'delivered',
     NOW() - INTERVAL '11 hours', NOW() - INTERVAL '9 hours', NOW() - INTERVAL '12 hours'),
    (3, 'PKG-AR-2024-006', 'Calle Lavalle 456, Buenos Aires, Argentina', 'in_transit',
     NOW() - INTERVAL '8 hours', NULL, NOW() - INTERVAL '10 hours'),
    (3, 'PKG-CL-2024-007', 'Av. Vicuña Mackenna 890, Santiago, Chile', 'ready_for_shipping',
     NULL, NULL, NOW() - INTERVAL '9 hours'),
    (3, 'PKG-AR-2024-007', 'Calle Tucumán 123, Córdoba, Argentina', 'pending',
     NULL, NULL, NOW() - INTERVAL '7 hours'),
    (3, 'PKG-CL-2024-008', 'Av. Apoquindo 567, Las Condes, Chile', 'in_transit',
     NOW() - INTERVAL '5 hours', NULL, NOW() - INTERVAL '6 hours');

-- Package 16-20: Mix of statuses (older packages)
INSERT INTO packages (user_id, tracking_number, destination_address, status, shipped_at, delivered_at, created_at) VALUES
    (3, 'PKG-AR-2024-008', 'Av. 9 de Julio 890, Buenos Aires, Argentina', 'delivered',
     NOW() - INTERVAL '6 days' - INTERVAL '3 hours', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days' - INTERVAL '5 hours'),
    (3, 'PKG-CL-2024-009', 'Calle Huérfanos 234, Santiago, Chile', 'pending',
     NULL, NULL, NOW() - INTERVAL '8 days'),
    (3, 'PKG-AR-2024-009', 'Av. Córdoba 567, Buenos Aires, Argentina', 'ready_for_shipping',
     NULL, NULL, NOW() - INTERVAL '7 days'),
    (3, 'PKG-CL-2024-010', 'Av. Matta 1100, Santiago, Chile', 'in_transit',
     NOW() - INTERVAL '3 days' - INTERVAL '2 hours', NULL, NOW() - INTERVAL '3 days' - INTERVAL '4 hours'),
    (3, 'PKG-AR-2024-010', 'Calle San Juan 890, San Juan, Argentina', 'delivered',
     NOW() - INTERVAL '4 days' - INTERVAL '5 hours', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' - INTERVAL '8 hours');

-- Package 21-25: Recent packages with various statuses
INSERT INTO packages (user_id, tracking_number, destination_address, status, shipped_at, delivered_at, created_at) VALUES
    (3, 'PKG-CL-2024-011', 'Av. Los Leones 456, Providencia, Chile', 'pending',
     NULL, NULL, NOW() - INTERVAL '3 hours'),
    (3, 'PKG-AR-2024-011', 'Calle Maipú 234, Vicente López, Argentina', 'ready_for_shipping',
     NULL, NULL, NOW() - INTERVAL '4 hours'),
    (3, 'PKG-CL-2024-012', 'Av. Italia 789, Santiago, Chile', 'in_transit',
     NOW() - INTERVAL '2 hours', NULL, NOW() - INTERVAL '3 hours'),
    (3, 'PKG-AR-2024-012', 'Av. Callao 567, Buenos Aires, Argentina', 'delivered',
     NOW() - INTERVAL '15 hours', NOW() - INTERVAL '13 hours', NOW() - INTERVAL '16 hours'),
    (3, 'PKG-CL-2024-013', 'Calle Esmeralda 123, Iquique, Chile', 'pending',
     NULL, NULL, NOW() - INTERVAL '1 hour');

-- Package 26-30: More packages for pagination testing
INSERT INTO packages (user_id, tracking_number, destination_address, status, shipped_at, delivered_at, created_at) VALUES
    (3, 'PKG-AR-2024-013', 'Av. Independencia 890, Tucumán, Argentina', 'in_transit',
     NOW() - INTERVAL '10 hours', NULL, NOW() - INTERVAL '11 hours'),
    (3, 'PKG-CL-2024-014', 'Av. Pedro de Valdivia 345, Ñuñoa, Chile', 'ready_for_shipping',
     NULL, NULL, NOW() - INTERVAL '5 hours'),
    (3, 'PKG-AR-2024-014', 'Calle Mitre 678, Bahía Blanca, Argentina', 'pending',
     NULL, NULL, NOW() - INTERVAL '6 hours'),
    (3, 'PKG-CL-2024-015', 'Av. La Florida 901, La Florida, Chile', 'delivered',
     NOW() - INTERVAL '1 day' - INTERVAL '8 hours', NOW() - INTERVAL '1 day' - INTERVAL '6 hours', NOW() - INTERVAL '1 day' - INTERVAL '10 hours'),
    (3, 'PKG-AR-2024-015', 'Av. Del Libertador 234, Vicente López, Argentina', 'in_transit',
     NOW() - INTERVAL '7 hours', NULL, NOW() - INTERVAL '8 hours');

-- Link products to packages (one product per package, quantity always 1)
INSERT INTO package_products (package_id, product_id, quantity) VALUES
    (1, 1, 1), -- Package 1: Wireless Headphones
    (2, 2, 1), -- Package 2: Smartphone Case
    (3, 7, 1), -- Package 3: Laptop Stand
    (4, 10, 1), -- Package 4: Hoodie
    (5, 4, 1), -- Package 5: Programming Guide
    (6, 8, 1), -- Package 6: Wireless Mouse
    (7, 3, 1), -- Package 7: USB-C Cable
    (8, 9, 1), -- Package 8: Design Principles
    (9, 5, 1), -- Package 9: Cotton T-Shirt
    (10, 11, 1), -- Package 10: Desk Lamp
    (11, 6, 1), -- Package 11: Coffee Mug
    (12, 12, 1), -- Package 12: Yoga Mat
    (13, 1, 1), -- Package 13: Wireless Headphones
    (14, 7, 1), -- Package 14: Laptop Stand
    (15, 2, 1), -- Package 15: Smartphone Case
    (16, 8, 1), -- Package 16: Wireless Mouse
    (17, 3, 1), -- Package 17: USB-C Cable
    (18, 9, 1), -- Package 18: Design Principles
    (19, 4, 1), -- Package 19: Programming Guide
    (20, 10, 1), -- Package 20: Hoodie
    (21, 5, 1), -- Package 21: Cotton T-Shirt
    (22, 11, 1), -- Package 22: Desk Lamp
    (23, 6, 1), -- Package 23: Coffee Mug
    (24, 12, 1), -- Package 24: Yoga Mat
    (25, 1, 1), -- Package 25: Wireless Headphones
    (26, 7, 1), -- Package 26: Laptop Stand
    (27, 2, 1), -- Package 27: Smartphone Case
    (28, 8, 1), -- Package 28: Wireless Mouse
    (29, 3, 1), -- Package 29: USB-C Cable
    (30, 9, 1); -- Package 30: Design Principles

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

-- Package 8 history (ready for shipping - was returned to warehouse)
INSERT INTO shipment_history (package_id, user_id, status, location, notes, event_timestamp) VALUES
    (8, 2, 'Label Created', 'Argentina Warehouse, Buenos Aires', 'Package created and label printed', NOW() - INTERVAL '3 days'),
    (8, 3, 'Package Ready', 'Argentina Warehouse, Buenos Aires', 'Package packed and ready for pickup', NOW() - INTERVAL '3 days' + INTERVAL '2 hours'),
    (8, 4, 'Picked Up', 'Argentina Warehouse, Buenos Aires', 'Picked up by carrier', NOW() - INTERVAL '3 days' + INTERVAL '3 hours'),
    (8, 4, 'In Transit', 'Distribution Center, Buenos Aires', 'Package in transit to Concepción', NOW() - INTERVAL '3 days' + INTERVAL '4 hours'),
    (8, 4, 'Returned to Warehouse', 'Argentina Warehouse, Buenos Aires', 'Incorrect address - returned to warehouse', NOW() - INTERVAL '3 days' + INTERVAL '5 hours');

-- Package 13 history (ready for shipping - was also returned)
INSERT INTO shipment_history (package_id, user_id, status, location, notes, event_timestamp) VALUES
    (13, 2, 'Label Created', 'Chile Warehouse, Santiago', 'Package created and label printed', NOW() - INTERVAL '9 hours'),
    (13, 3, 'Package Ready', 'Chile Warehouse, Santiago', 'Package packed', NOW() - INTERVAL '8 hours'),
    (13, 4, 'Picked Up', 'Chile Warehouse, Santiago', 'Picked up by carrier', NOW() - INTERVAL '7 hours'),
    (13, 4, 'In Transit', 'Distribution Center, Santiago', 'Package in transit to Concepción', NOW() - INTERVAL '6 hours'),
    (13, 4, 'Returned to Warehouse', 'Chile Warehouse, Santiago', 'Delivery failed - recipient not available', NOW() - INTERVAL '5 hours');

-- Package 18 history (ready for shipping - returned multiple times)
INSERT INTO shipment_history (package_id, user_id, status, location, notes, event_timestamp) VALUES
    (18, 2, 'Label Created', 'Argentina Warehouse, Buenos Aires', 'Package created', NOW() - INTERVAL '7 days'),
    (18, 3, 'Package Ready', 'Argentina Warehouse, Buenos Aires', 'Package packed', NOW() - INTERVAL '7 days' + INTERVAL '1 hour'),
    (18, 4, 'Picked Up', 'Argentina Warehouse, Buenos Aires', 'First pickup', NOW() - INTERVAL '7 days' + INTERVAL '2 hours'),
    (18, 4, 'In Transit', 'Distribution Center, Buenos Aires', 'Package in transit to Concepción', NOW() - INTERVAL '7 days' + INTERVAL '3 hours'),
    (18, 4, 'Returned to Warehouse', 'Argentina Warehouse, Buenos Aires', 'Address issue', NOW() - INTERVAL '7 days' + INTERVAL '4 hours'),
    (18, 4, 'Picked Up', 'Argentina Warehouse, Buenos Aires', 'Second pickup attempt', NOW() - INTERVAL '5 days'),
    (18, 4, 'In Transit', 'Distribution Center, Buenos Aires', 'Package in transit to Concepción', NOW() - INTERVAL '5 days' + INTERVAL '4 hours'),
    (18, 4, 'Returned to Warehouse', 'Argentina Warehouse, Buenos Aires', 'Delivery failed again', NOW() - INTERVAL '5 days' + INTERVAL '3 hours');

-- Package 27 history (ready for shipping - recently returned)
INSERT INTO shipment_history (package_id, user_id, status, location, notes, event_timestamp) VALUES
    (27, 2, 'Label Created', 'Chile Warehouse, Santiago', 'Package created', NOW() - INTERVAL '5 hours'),
    (27, 3, 'Package Ready', 'Chile Warehouse, Santiago', 'Package packed', NOW() - INTERVAL '4 hours'),
    (27, 4, 'Picked Up', 'Chile Warehouse, Santiago', 'Picked up', NOW() - INTERVAL '3 hours'),
    (27, 4, 'In Transit', 'Distribution Center, Santiago', 'Package in transit to Concepción', NOW() - INTERVAL '2 hours'),
    (27, 4, 'Returned to Warehouse', 'Chile Warehouse, Santiago', 'Wrong package dimensions', NOW() - INTERVAL '2 hours');
