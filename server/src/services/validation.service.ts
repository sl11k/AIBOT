import { NUTRITION_KEYWORDS, VALIDATION_PROMPT } from '../config/constants';
import { logger } from '../utils/logger';
import { perplexityClient } from './perplexity.client';

export class ValidationService {
  /**
   * Validates if the user query is related to nutrition using a multi-step approach.
   * 1. Check for explicit coding/programming keywords (Fast Fail).
   * 2. Use AI to understand the intent and context (Smart Check).
   * 
   * @param query User's question
   * @returns Promise<boolean>
   */
  public async validateQuery(query: string): Promise<{ isValid: boolean; reason?: string }> {
    if (!query) return { isValid: false, reason: "Empty query" };

    const lowerQuery = query.toLowerCase();

    // 1. Fast Fail: Explicit coding/programming keywords
    const codingKeywords = [
      'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin',
      'code', 'programming', 'script', 'function', 'variable', 'class', 'api', 'endpoint', 'json', 
      'xml', 'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
      'sql', 'database', 'docker', 'kubernetes', 'aws', 'azure', 'git', 'github'
    ];
    
    // Exception: "code" might be used in "genetic code" or "code of ethics".
    // But for now, let's rely on the AI check for nuance, or just warn.
    // Actually, let's skip the hard blocklist and let the AI decide, 
    // because "How does genetic code affect metabolism?" contains "code".
    // "How to code a diet plan" -> Invalid.
    // The AI is better at this.

    // 2. AI Validation (The "Check more than once" logic)
    try {
      const prompt = VALIDATION_PROMPT.replace('{{QUERY}}', query);
      
      const response = await perplexityClient.chat([
        { role: 'user', content: prompt }
      ]);

      // Parse JSON from response
      const jsonMatch = response.answer.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        if (result.is_allowed === true) {
          return { isValid: true };
        } else {
          logger.warn(`Query rejected by AI validator: "${query}" - Reason: ${result.reason}`);
          return { isValid: false, reason: result.reason || "Not related to nutrition or professional practice." };
        }
      } else {
        // Fallback if JSON parsing fails: Check for keywords again as a safety net?
        // Or assume valid if AI didn't explicitly say NO?
        // Let's assume valid but log warning.
        logger.warn(`AI Validator returned non-JSON response. Fallback to keyword check.`);
        const hasKeyword = NUTRITION_KEYWORDS.some(keyword => lowerQuery.includes(keyword));
        return { isValid: hasKeyword, reason: "Fallback validation failed." };
      }

    } catch (error) {
      logger.error("AI Validation failed, falling back to keywords", error);
      // Fallback to keywords
      const hasKeyword = NUTRITION_KEYWORDS.some(keyword => lowerQuery.includes(keyword));
      return { isValid: hasKeyword, reason: "System error during validation." };
    }
  }

  /**
   * Legacy synchronous check (deprecated but kept for compatibility if needed)
   */
  public isNutritionRelated(query: string): boolean {
    if (!query) return false;
    const lowerQuery = query.toLowerCase();
    return NUTRITION_KEYWORDS.some(keyword => lowerQuery.includes(keyword));
  }
}

export const validationService = new ValidationService();
