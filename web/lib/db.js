import pg from "pg";

const { Pool } = pg;

let pool = null;

if (process.env.DATABASE_URL) {
  const isLocal = process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1");
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
} else {
  // Mock pool interface when DATABASE_URL is not configured
  pool = {
    query: async () => ({ rows: [] }),
  };
}

export default pool;