export const APP_NAME = 'NutriCare Perplexity Research Bot';

export const PERPLEXITY_CONFIG = {
  API_URL: 'https://api.perplexity.ai/chat/completions',
  MODEL: 'sonar-pro',
  TIMEOUT_MS: 60000, // 60 seconds
};

export const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS: 30, // 30 requests per minute
};

export * from './keywords';
export * from './prompts';
