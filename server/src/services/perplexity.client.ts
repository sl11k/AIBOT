import axios from 'axios';
import { env } from '../config/env';
import { PERPLEXITY_CONFIG } from '../config/constants';
import { logger } from '../utils/logger';

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
    delta?: {
      role: string;
      content: string;
    };
  }[];
  citations?: string[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class PerplexityClient {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor() {
    this.apiKey = env.PERPLEXITY_API_KEY;
    this.apiUrl = PERPLEXITY_CONFIG.API_URL;
    this.model = PERPLEXITY_CONFIG.MODEL;

    if (!this.apiKey) {
      logger.error('Perplexity API Key is missing!');
    }
  }

  public async chat(messages: PerplexityMessage[]): Promise<{ answer: string; citations: string[] }> {
    try {
      logger.info('Sending request to Perplexity API', { model: this.model });

      const payload = {
        model: this.model,
        messages: messages,
        temperature: 0.2, // Low temperature for factual accuracy
        top_p: 0.9,
        return_citations: true, // Crucial for research
        search_domain_filter: [], // Can filter domains if needed, but we want broad research
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month', // Prefer recent info? Or remove for general knowledge. Let's keep it open or default. 'month' is good for news, but nutrition science is slower. Let's remove to get all time best results.
      };

      // Remove search_recency_filter from payload if not needed to avoid restriction
      delete (payload as any).search_recency_filter;

      const response = await axios.post<PerplexityResponse>(
        this.apiUrl,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: PERPLEXITY_CONFIG.TIMEOUT_MS,
        }
      );

      const choice = response.data.choices[0];
      const answer = choice.message.content;
      const citations = response.data.citations || [];

      logger.info('Received response from Perplexity', { 
        tokens: response.data.usage?.total_tokens,
        citations_count: citations.length 
      });

      return { answer, citations };

    } catch (error: any) {
      logger.error('Perplexity API Error', { 
        message: error.message, 
        response: error.response?.data 
      });
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch answer from Perplexity');
    }
  }
}

export const perplexityClient = new PerplexityClient();
