/**
 * Validated environment variables for server-side use only.
 * Never expose these to the client.
 * Validation is lazy — only checked when the key is actually accessed.
 */

export function getGeminiApiKey(): string {
  const value = process.env.GEMINI_API_KEY;
  if (!value) {
    throw new Error(
      '❌ Missing required environment variable: GEMINI_API_KEY\n' +
      '   Get your free API key at: https://aistudio.google.com/apikey'
    );
  }
  return value;
}
