import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSql(sql) {
  // Split SQL into individual statements and execute them
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec', { sql: statement + ';' });
      if (error) {
        console.warn(`Statement skipped (might exist): ${statement.substring(0, 50)}...`);
      }
    } catch (e) {
      console.warn(`Statement error (might exist): ${e.message}`);
    }
  }
}

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database schema...');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    await executeSql(schemaSql);
    console.log('✓ Schema created');

    console.log('🌱 Seeding database with test data...');
    
    // Read and execute seed
    const seedPath = path.join(__dirname, 'seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');
    await executeSql(seedSql);
    console.log('✓ Seed data inserted');

    console.log('\n✨ Database setup complete!');
  } catch (error) {
    console.error('Setup error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
