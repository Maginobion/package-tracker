-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('admin', 'Administrator with access to app settings and users data'),
    ('warehouse_receiver', 'Receives and validates products into the warehouse'),
    ('warehouse_packer', 'Packs packages for delivery and puts them on the truck'),
    ('carrier', 'Delivery carrier who transports packages from the warehouse to the destination');

-- Insert sample users
-- Password for all users: "password123" (hashed with bcrypt, cost factor 10)
INSERT INTO users (first_name, last_name, email, password_hash) VALUES
    ('John', 'Doe', 'admin@example.com', '$2b$10$n4TnsLmLPe09If8loaQ4ZOZ7sxZyf0X3oISc9Zl.k4.hWZvGN7bhO'),
    ('Jane', 'Smith', 'receiver@example.com', '$2b$10$n4TnsLmLPe09If8loaQ4ZOZ7sxZyf0X3oISc9Zl.k4.hWZvGN7bhO'),
    ('Bob', 'Johnson', 'packer@example.com', '$2b$10$n4TnsLmLPe09If8loaQ4ZOZ7sxZyf0X3oISc9Zl.k4.hWZvGN7bhO'),
    ('Alice', 'Williams', 'carrier@example.com', '$2b$10$n4TnsLmLPe09If8loaQ4ZOZ7sxZyf0X3oISc9Zl.k4.hWZvGN7bhO');

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


