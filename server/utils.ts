export function extractMintFromUrl(url: string): string | null {
  // Extract mint address from URL
  // This is a placeholder - adjust the regex based on your actual URL format
  const match = url.match(/mint=([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}