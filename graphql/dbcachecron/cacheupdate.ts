import cron from 'node-cron';
import { refreshCacheEntries, cleanExpiredCache, getActiveKeys } from '../database.js'; // Added getActiveKeys import
import { WhoisAPI } from '../whois-api.js';
import { mapJsonToSchema } from '../schema.js'; // Adjust the import path as necessary

const whoisAPI = new WhoisAPI();

async function refreshAllCacheEntries() {
  // Clean up expired cache entries
  await cleanExpiredCache();
  const activeKeys = await getActiveKeys(); // Now directly using the function from database.ts

  const entriesToUpdate = [];
  for (const key of activeKeys) {
    const response = await whoisAPI.getInformation(key);
    if (response.success && response.data) {
      const data = mapJsonToSchema(response.data);
      entriesToUpdate.push({ key, data });
    }
  }

  if (entriesToUpdate.length > 0) {
    await refreshCacheEntries(entriesToUpdate);
  }
}
// Schedule Cacheupdate
export function startCacheUpdateCronJob() {
    // Schedule the task to run once a day at midnight (00:00)
    cron.schedule('0 0 * * *', () => {
      console.log('[cacheupdate] Running scheduled cache update...');
      refreshAllCacheEntries();
    });
    console.log('[cacheuodate] Cache update cron job scheduled.');
  }