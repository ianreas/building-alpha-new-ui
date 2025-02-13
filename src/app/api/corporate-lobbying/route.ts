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
type CorporateLobbying = {
  id: number;
  ticker: string;
  date: string;
  issue: string;
  amount: string
};

export async function GET() {
  const client = await pool.connect();
  try {
    const queryText = `
      SELECT id, ticker, date, issue, amount
      FROM corporate_lobbying
      ORDER BY id
      LIMIT 10;
    `;
    const result = await client.query<CorporateLobbying>(queryText);
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