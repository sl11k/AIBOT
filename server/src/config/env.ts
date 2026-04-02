import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY || '',
};

if (!env.PERPLEXITY_API_KEY) {
  console.warn('WARNING: PERPLEXITY_API_KEY is not set in environment variables.');
}
