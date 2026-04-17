import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;

let connectionString = process.env.POSTGRES_URL;
if (connectionString) {
  connectionString = connectionString.replace(/sslmode=require/, 'sslmode=no-verify');
}

const pool = new Pool({
  connectionString,
});

// Password hashes for 'password123'
const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

async function setupDatabase() {
  let client;
  try {
    client = await pool.connect();
    console.log('[v0] Connected to database');

    // Create schema
    console.log('[v0] Creating tables...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('student', 'staff')),
        phone TEXT,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS outlets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        opening_time TIME NOT NULL,
        closing_time TIME NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image_url TEXT,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
        total_price DECIMAL(10, 2) NOT NULL,
        queue_number INT,
        estimated_time INT,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        menu_item_id UUID NOT NULL REFERENCES menu_items(id),
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
    `);
    
    console.log('[v0] Tables created successfully');

    // Clear existing data
    console.log('[v0] Clearing existing data...');
    await client.query('DELETE FROM order_items;');
    await client.query('DELETE FROM orders;');
    await client.query('DELETE FROM menu_items;');
    await client.query('DELETE FROM outlets;');
    await client.query('DELETE FROM users;');

    // Hash password
    const passwordHash = await hashPassword('password123');
    console.log('[v0] Password hashed');

    // Seed users
    console.log('[v0] Seeding users...');
    await client.query(`
      INSERT INTO users (name, email, password_hash, role, phone) VALUES
        ('Student One', 'student1@example.com', $1, 'student', '9876543210'),
        ('Student Two', 'student2@example.com', $1, 'student', '9876543211'),
        ('Student Three', 'student3@example.com', $1, 'student', '9876543212'),
        ('Staff Member', 'staff@canteen.com', $1, 'staff', '9876543213')
    `, [passwordHash]);

    // Seed outlets
    console.log('[v0] Seeding outlets...');
    const outletResult = await client.query(`
      INSERT INTO outlets (name, location, opening_time, closing_time, is_active) VALUES
        ('REC CAFE', 'Recreation Center', '07:00:00', '18:00:00', true),
        ('REC MART', 'Recreation Building', '08:00:00', '17:00:00', true),
        ('HUT CAFE', 'Student Hut', '10:00:00', '16:00:00', true),
        ('SIXTH SENSE', 'Main Campus', '09:00:00', '19:00:00', true)
      RETURNING id, name
    `);

    const outlets = outletResult.rows;
    console.log('[v0] Outlets created:', outlets.map(o => o.name));

    // Seed menu items
    console.log('[v0] Seeding menu items...');
    
    for (const outlet of outlets) {
      const outletId = outlet.id;
      const items = getMenuItemsForOutlet(outlet.name);
      
      for (const item of items) {
        await client.query(`
          INSERT INTO menu_items (outlet_id, name, description, category, price, is_available) VALUES
            ($1, $2, $3, $4, $5, true)
        `, [outletId, item.name, item.description, item.category, item.price]);
      }
    }

    console.log('[v0] Menu items seeded');
    console.log('[v0] Database setup complete!');
    console.log('[v0] Test credentials: student1@example.com / password123');

  } catch (err) {
    console.error('[v0] Error:', err.message);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

function getMenuItemsForOutlet(outletName) {
  const menus = {
    'REC CAFE': [
      { name: 'Paneer Butter Masala', description: 'Creamy paneer in tomato gravy', category: 'Curries', price: 120 },
      { name: 'Chicken Biryani', description: 'Fragrant basmati rice with chicken', category: 'Rice', price: 150 },
      { name: 'Samosa', description: 'Crispy pastry with potato filling', category: 'Snacks', price: 25 },
      { name: 'Masala Dosa', description: 'Crispy crepe with potato filling', category: 'South Indian', price: 80 },
      { name: 'Choco Shake', description: 'Creamy chocolate milkshake', category: 'Beverages', price: 50 },
    ],
    'REC MART': [
      { name: 'Aloo Paratha', description: 'Stuffed flatbread with potatoes', category: 'Breads', price: 60 },
      { name: 'Chole Bhature', description: 'Deep fried bread with chickpea curry', category: 'North Indian', price: 90 },
      { name: 'Vada Pav', description: 'Spicy potato fritter in bread', category: 'Snacks', price: 30 },
      { name: 'Mango Lassi', description: 'Yogurt-based mango drink', category: 'Beverages', price: 40 },
    ],
    'HUT CAFE': [
      { name: 'Idli', description: 'Steamed rice cakes', category: 'South Indian', price: 35 },
      { name: 'Upma', description: 'Semolina breakfast dish', category: 'South Indian', price: 45 },
      { name: 'Puri Bhaji', description: 'Fried bread with potato curry', category: 'North Indian', price: 55 },
      { name: 'Coffee', description: 'Hot filter coffee', category: 'Beverages', price: 30 },
    ],
    'SIXTH SENSE': [
      { name: 'Margherita Pizza', description: 'Fresh mozzarella and basil', category: 'Fast Food', price: 180 },
      { name: 'Grilled Sandwich', description: 'Vegetable with cheese', category: 'Sandwiches', price: 75 },
      { name: 'Garlic Bread', description: 'Crispy bread with garlic butter', category: 'Breads', price: 55 },
      { name: 'Iced Tea', description: 'Refreshing iced tea', category: 'Beverages', price: 45 },
    ],
  };

  return menus[outletName] || [];
}

setupDatabase();
