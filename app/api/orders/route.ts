import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

let connectionString = process.env.POSTGRES_URL;
if (connectionString) {
  connectionString = connectionString.replace(/sslmode=require/, 'sslmode=no-verify');
}

const pool = new Pool({
  connectionString,
});

export async function POST(request: NextRequest) {
  try {
    const { user_id, outlet_id, total_price, items } = await request.json();

    if (!user_id || !outlet_id || !total_price || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, outlet_id, total_price, status, created_at)
         VALUES ($1, $2, $3, 'pending', NOW())
         RETURNING id, user_id, outlet_id, total_price, status, created_at`,
        [user_id, outlet_id, total_price]
      );

      const orderId = orderResult.rows[0].id;

      // Insert order items
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.menu_item_id, item.quantity, item.price]
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        order: orderResult.rows[0],
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, user_id, outlet_id, total_price, status, created_at
         FROM orders
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return NextResponse.json({
        success: true,
        orders: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
