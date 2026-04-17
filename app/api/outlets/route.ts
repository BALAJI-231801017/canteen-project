import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

let connectionString = process.env.POSTGRES_URL;
if (connectionString) {
  connectionString = connectionString.replace(/sslmode=require/, 'sslmode=no-verify');
}

const pool = new Pool({
  connectionString,
});

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, name, location, cuisines FROM outlets ORDER BY name'
      );

      return NextResponse.json({
        success: true,
        outlets: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Outlets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
