import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
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
        `SELECT o.id, o.user_id, o.outlet_id, o.total_price, o.status, o.created_at, u.name as user_name
         FROM orders o
         JOIN users u ON o.user_id = u.id
         WHERE o.outlet_id = $1
         ORDER BY o.created_at DESC`,
        [outletId]
      );

      return NextResponse.json({
        success: true,
        orders: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Admin orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
