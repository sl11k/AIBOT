export function sanitizeInput(input: string): string {
  if (!input) return '';
  // Remove potentially harmful characters but keep alphanumeric and basic punctuation
  // Remove script tags or SQL injection attempts
  return input
    .trim()
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '') // Remove scripts
    .replace(/['";\\]/g, '') // Remove quotes, semi-colons, backslashes to prevent SQL/CMD injection (basic)
    .slice(0, 1000); // Limit length
}
