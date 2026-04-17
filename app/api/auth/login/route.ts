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
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, name, email, outlet_id FROM users WHERE email = $1 AND password = $2',
        [email, password]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const user = result.rows[0];
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          outlet_id: user.outlet_id,
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
