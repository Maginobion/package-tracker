-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('admin', 'Administrator with access to app settings and users data'),
    ('warehouse_receiver', 'Receives and validates products into the warehouse'),
    ('warehouse_packer', 'Packs packages for delivery and puts them on the truck'),
    ('carrier', 'Delivery carrier who transports packages from the warehouse to the destination');

-- Insert sample users
INSERT INTO users (first_name, last_name, email, password_hash) VALUES
    ('John', 'Doe', 'admin@example.com', '$2b$10$rKvVJnN3Y8bH7jXqH5hQX.zJjQJXc0J5nW5h7Wz8Z9x7Y6Z5W4X3Y2'),
    ('Jane', 'Smith', 'receiver@example.com', '$2b$10$rKvVJnN3Y8bH7jXqH5hQX.zJjQJXc0J5nW5h7Wz8Z9x7Y6Z5W4X3Y2'),
    ('Bob', 'Johnson', 'packer@example.com', '$2b$10$rKvVJnN3Y8bH7jXqH5hQX.zJjQJXc0J5nW5h7Wz8Z9x7Y6Z5W4X3Y2'),
    ('Alice', 'Williams', 'carrier@example.com', '$2b$10$rKvVJnN3Y8bH7jXqH5hQX.zJjQJXc0J5nW5h7Wz8Z9x7Y6Z5W4X3Y2');

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id) VALUES
    (1, 1), -- John Doe is admin
    (2, 2), -- Jane Smith is warehouse receiver
    (3, 3), -- Bob Johnson is warehouse packer
    (4, 4); -- Alice Williams is carrier

-- Insert sample warehouses

-- Create a warehouse in Chile and another one in Argentina (country)
INSERT INTO warehouses (name, address) VALUES
  ('Chile Warehouse', 'Av. Américo Vespucio 1501, Quilicura, Santiago, Chile'),
  ('Argentina Warehouse', 'Av. Warnes 2708, Buenos Aires, Argentina');


