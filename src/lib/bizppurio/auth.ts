import { BizppurioTokenResponse } from './types';

// In-memory cache for Vercel instances (will reload on cold start but helps during spikes)
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0; // Epoch ms

export async function getBizppurioAccessToken(): Promise<string> {
  const accountId = process.env.BIZPPURIO_ACCOUNT_ID;
  const password = process.env.BIZPPURIO_PASSWORD;
  const baseUrl = process.env.BIZPPURIO_BASE_URL || 'https://api.bizppurio.com';

  if (!accountId || !password) {
    throw new Error('Bizppurio credentials are missing');
  }

  // Check cache and expiration (leave 5 min buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 300000) {
    return cachedToken;
  }

  const basicAuth = Buffer.from(`${accountId}:${password}`).toString('base64');

  const res = await fetch(`${baseUrl}/v1/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    },
    // Prevent Next.js from aggressively caching this for all users
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`Failed to get Bizppurio token: ${res.statusText}`);
  }

  const data: BizppurioTokenResponse = await res.json();
  
  cachedToken = data.accesstoken;
  
  // parse expired "YYYYMMDDHHMMSS" safely or just add 23 hours to cache valid time
  // Token usually expires in 24 hours
  tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000;
  
  return cachedToken;
}
