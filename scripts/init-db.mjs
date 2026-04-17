import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let connectionString = process.env.POSTGRES_URL;
if (connectionString) {
  connectionString = connectionString.replace(/sslmode=require/, 'sslmode=no-verify');
}

const pool = new Pool({
  connectionString,
});

async function readAndExecuteSql(filePath) {
  const sql = fs.readFileSync(filePath, 'utf-8');
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      await pool.query(statement);
      console.log(`✓ Executed: ${statement.substring(0, 60)}...`);
    } catch (error) {
      console.warn(`⚠ Skipped (might exist): ${statement.substring(0, 60)}...`);
    }
  }
}

async function initializeDatabase() {
  try {
    console.log('🔧 Setting up database schema...\n');
    
    const schemaPath = path.join(__dirname, 'schema.sql');
    await readAndExecuteSql(schemaPath);
    
    console.log('\n🌱 Seeding database with test data...\n');
    
    const seedPath = path.join(__dirname, 'seed.sql');
    await readAndExecuteSql(seedPath);
    
    console.log('\n✨ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
