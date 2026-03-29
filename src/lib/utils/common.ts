/**
 * Simple delay promise.
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches with automatic retry for rate limits (429, 503).
 */
export const fetchWithRetry = async (
  url: string, 
  options: RequestInit, 
  maxRetries = 3,
  retryDelay = 5000
): Promise<Response> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options);
    if (response.ok) return response;
    
    const data = await response.json().catch(() => ({}));
    const isRateLimit = response.status === 429 || response.status === 503;
    
    if (isRateLimit && attempt < maxRetries - 1) {
      const waitTime = (attempt + 1) * retryDelay;
      await delay(waitTime);
      continue;
    }
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  throw new Error('Max retries exceeded');
};
