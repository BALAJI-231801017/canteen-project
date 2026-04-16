-- Seed test users (passwords are hashed, these are example hashes for 'password123')
-- In production, these should be properly hashed with bcrypt
INSERT INTO users (id, name, email, password_hash, role, phone) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Rahul Kumar', 'rahul@student.com', '$2b$10$YourHashedPasswordHere1', 'student', '9876543210'),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Priya Singh', 'priya@student.com', '$2b$10$YourHashedPasswordHere2', 'student', '9876543211'),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Akshay Patel', 'akshay@student.com', '$2b$10$YourHashedPasswordHere3', 'student', '9876543212'),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Staff Member', 'staff@canteen.com', '$2b$10$YourHashedPasswordHere4', 'staff', '9876543213');

-- Seed outlets
INSERT INTO outlets (id, name, location, opening_time, closing_time, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440011'::uuid, 'Main Canteen', 'Central Building, 1st Floor', '07:00:00', '18:00:00', true),
  ('550e8400-e29b-41d4-a716-446655440012'::uuid, 'North Wing Cafe', 'North Building', '08:00:00', '17:00:00', true),
  ('550e8400-e29b-41d4-a716-446655440013'::uuid, 'South Stall', 'South Campus', '10:00:00', '16:00:00', true),
  ('550e8400-e29b-41d4-a716-446655440014'::uuid, 'Library Cafe', 'Library Building', '09:00:00', '19:00:00', true);

-- Seed menu items for Main Canteen
INSERT INTO menu_items (id, outlet_id, name, description, category, price, is_available) VALUES
  ('550e8400-e29b-41d4-a716-446655440101'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, 'Paneer Butter Masala', 'Creamy paneer in tomato gravy', 'Curries', 120.00, true),
  ('550e8400-e29b-41d4-a716-446655440102'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, 'Chicken Biryani', 'Fragrant basmati rice with chicken', 'Rice', 150.00, true),
  ('550e8400-e29b-41d4-a716-446655440103'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, 'Samosa', 'Crispy pastry with potato filling', 'Snacks', 25.00, true),
  ('550e8400-e29b-41d4-a716-446655440104'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, 'Masala Dosa', 'Crispy crepe with potato filling', 'South Indian', 80.00, true),
  ('550e8400-e29b-41d4-a716-446655440105'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, 'Choco Shake', 'Creamy chocolate milkshake', 'Beverages', 50.00, true);

-- Seed menu items for North Wing Cafe
INSERT INTO menu_items (id, outlet_id, name, description, category, price, is_available) VALUES
  ('550e8400-e29b-41d4-a716-446655440106'::uuid, '550e8400-e29b-41d4-a716-446655440012'::uuid, 'Aloo Paratha', 'Stuffed flatbread with potatoes', 'Breads', 60.00, true),
  ('550e8400-e29b-41d4-a716-446655440107'::uuid, '550e8400-e29b-41d4-a716-446655440012'::uuid, 'Chole Bhature', 'Deep fried bread with chickpea curry', 'North Indian', 90.00, true),
  ('550e8400-e29b-41d4-a716-446655440108'::uuid, '550e8400-e29b-41d4-a716-446655440012'::uuid, 'Vada Pav', 'Spicy potato fritter in bread', 'Snacks', 30.00, true);

-- Seed menu items for South Stall
INSERT INTO menu_items (id, outlet_id, name, description, category, price, is_available) VALUES
  ('550e8400-e29b-41d4-a716-446655440109'::uuid, '550e8400-e29b-41d4-a716-446655440013'::uuid, 'Idli', 'Steamed rice cakes', 'South Indian', 35.00, true),
  ('550e8400-e29b-41d4-a716-446655440110'::uuid, '550e8400-e29b-41d4-a716-446655440013'::uuid, 'Upma', 'Semolina breakfast dish', 'South Indian', 45.00, true),
  ('550e8400-e29b-41d4-a716-446655440111'::uuid, '550e8400-e29b-41d4-a716-446655440013'::uuid, 'Mango Lassi', 'Yogurt-based mango drink', 'Beverages', 40.00, true);

-- Seed menu items for Library Cafe
INSERT INTO menu_items (id, outlet_id, name, description, category, price, is_available) VALUES
  ('550e8400-e29b-41d4-a716-446655440112'::uuid, '550e8400-e29b-41d4-a716-446655440014'::uuid, 'Margherita Pizza', 'Fresh mozzarella and basil', 'Fast Food', 180.00, true),
  ('550e8400-e29b-41d4-a716-446655440113'::uuid, '550e8400-e29b-41d4-a716-446655440014'::uuid, 'Grilled Sandwich', 'Vegetable with cheese', 'Sandwiches', 75.00, true),
  ('550e8400-e29b-41d4-a716-446655440114'::uuid, '550e8400-e29b-41d4-a716-446655440014'::uuid, 'Garlic Bread', 'Crispy bread with garlic butter', 'Breads', 55.00, true);
