import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

let connectionString = process.env.POSTGRES_URL;
if (connectionString) {
  connectionString = connectionString.replace(/sslmode=require/, 'sslmode=no-verify');
}

const pool = new Pool({
  connectionString,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const client = await pool.connect();
    try {
      // Get order details
      const orderResult = await client.query(
        `SELECT id, user_id, outlet_id, total_price, status, created_at
         FROM orders
         WHERE id = $1`,
        [id]
      );

      if (orderResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      // Get order items
      const itemsResult = await client.query(
        `SELECT oi.id, oi.menu_item_id, oi.quantity, oi.price, mi.name
         FROM order_items oi
         JOIN menu_items mi ON oi.menu_item_id = mi.id
         WHERE oi.order_id = $1`,
        [id]
      );

      return NextResponse.json({
        success: true,
        order: orderResult.rows[0],
        items: itemsResult.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Order details error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE orders
         SET status = $1
         WHERE id = $2
         RETURNING id, user_id, outlet_id, total_price, status, created_at`,
        [status, id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        order: result.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
