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
    const { searchParams } = new URL(request.url);
    const outletId = searchParams.get('outlet_id');

    if (!outletId) {
      return NextResponse.json(
        { error: 'outlet_id is required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, name, description, price, category, available 
         FROM menu_items 
         WHERE outlet_id = $1 
         ORDER BY category, name`,
        [outletId]
      );

      return NextResponse.json({
        success: true,
        menu_items: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Menu error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
