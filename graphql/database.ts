import pkg from 'pg';
const { Pool } = pkg;

// Initialize PostgreSQL client
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

type CacheKeyRow = {
    key: string;
  };

// Function to get cached response
export async function getCachedResponse(key: string): Promise<any> {
  const result = await pool.query('SELECT data FROM cache WHERE key = $1 AND expires_at > NOW()', [key]);
  return result.rows[0]?.data || null;
}

// Function to save response to cache
//export async function saveToCache(key: string, data: any): Promise<void> {
//  const ttl = 30; // days
//  await pool.query('INSERT INTO cache(key, data, expires_at) VALUES($1, $2, NOW() + INTERVAL \'$3 days\') ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, expires_at = EXCLUDED.expires_at', [key, data, ttl]);
//}
export async function saveToCache(key: string, data: any, days: number): Promise<void> {
    const interval = `${days} days`;
    await pool.query(
      'INSERT INTO cache(key, data, expires_at) VALUES($1, $2, NOW() + $3::interval) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, expires_at = EXCLUDED.expires_at',
      [key, data, interval]
    );
  }


// Optional: Function to clean up expired cache entries
export async function cleanExpiredCache(): Promise<void> {
  await pool.query('SELECT delete_expired_cache_entries();');
}
// get all active keys
export async function getActiveKeys(): Promise<string[]> {
    const result = await pool.query<CacheKeyRow>('SELECT key FROM cache'); // Adjust this query based on your definition of "active"
    return result.rows.map( (row: any)  => row.key);
}


//bulk update queries updating key and data from non expired entries
export async function refreshCacheEntries(entries: { key: string; data: any }[]): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        for (const { key, data } of entries) {
            await client.query(
              'UPDATE cache SET data = $2 WHERE key = $1',
              [key, JSON.stringify(data)] // Assuming `data` needs to be stringified for JSONB column
            );
        }
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}