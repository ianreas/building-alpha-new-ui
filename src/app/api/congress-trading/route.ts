import { NextResponse } from "next/server";
import { Pool } from "pg";

// If you have your DATABASE_URL in .env, Next.js loads it automatically if named properly.
// For example, in .env:
// DATABASE_URL=postgresql://user:password@hostname:5432/dbname

const pool = new Pool({
  connectionString: "postgresql://postgres:muhammedik10@paas-backend-1.cbigmg0cgxs7.us-east-1.rds.amazonaws.com:5432/paas_backend",
  ssl: {
    rejectUnauthorized: false, // for local dev/test only
  },
});

// Strictly typed TypeScript definition for your table rows
type CongressionalTrading = {
  id: number;
  ticker: string;
  politican_name: string;
  politician_party: string;
  transaction_type: string;
  disclosed_date: string;
};

export async function GET() {
  const client = await pool.connect();
  try {
    const queryText = `
      SELECT id, ticker, politican_name, politician_party, transaction_type, disclosed_date
      FROM congressional_trading
      ORDER BY id
      LIMIT 10;
    `;
    const result = await client.query<CongressionalTrading>(queryText);
    console.log(result.rows);
    return NextResponse.json(result.rows);
  } catch (error) {
    // Log error or handle the case gracefully
    return NextResponse.json(
      { error: "Error fetching data." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
