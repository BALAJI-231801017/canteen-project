import pg from 'pg';
const { Pool } = pg;

let connectionString = process.env.POSTGRES_URL;
if (connectionString) {
  connectionString = connectionString.replace(/sslmode=require/, 'sslmode=no-verify');
}

const pool = new Pool({
  connectionString,
});

try {
  console.log('[v0] Testing database connection...');
  console.log('[v0] Connection string:', process.env.POSTGRES_URL?.substring(0, 50) + '...');
  
  const result = await pool.query('SELECT NOW()');
  console.log('[v0] Connection successful!');
  console.log('[v0] Current time from DB:', result.rows[0]);
  
  // Check for tables
  const tablesResult = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
  );
  console.log('[v0] Tables found:', tablesResult.rows.map(r => r.table_name));
  
  await pool.end();
  process.exit(0);
} catch (err) {
  console.error('[v0] Connection error:', err.message);
  process.exit(1);
}
