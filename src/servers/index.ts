import { McpServerPlugin } from './base.js';
import { googleAnalytics } from './google-analytics.js';
import { clarity } from './clarity.js';
import { searchConsole } from './search-console.js';
import { shopify } from './shopify.js';
import { googleAds } from './google-ads.js';

export const servers: McpServerPlugin[] = [
  googleAnalytics,
  clarity,
  searchConsole,
  shopify,
  googleAds,
];

export function getServerById(id: string): McpServerPlugin | undefined {
  return servers.find(s => s.id === id);
}
