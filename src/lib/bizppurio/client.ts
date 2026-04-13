import { getBizppurioAccessToken } from './auth';

export async function bizppurioFetch(endpoint: string, options: RequestInit = {}) {
  const token = await getBizppurioAccessToken();
  const baseUrl = process.env.BIZPPURIO_BASE_URL || 'https://api.bizppurio.com';
  
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  return res;
}
