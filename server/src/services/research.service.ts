import { perplexityClient } from './perplexity.client';
import { validationService } from './validation.service';
import { logger } from '../utils/logger';
import { SYSTEM_PROMPT, MEDICAL_DISCLAIMER_AR, MEDICAL_DISCLAIMER_EN } from '../config/constants';

interface ResearchResult {
  answer: string;
  sources: string[];
}

export class ResearchService {
  /**
   * Orchestrates the research process:
   * 1. Validates the query domain.
   * 2. Calls Perplexity API.
   * 3. Formats the response with citations and medical disclaimer.
   */
  public async research(query: string): Promise<ResearchResult> {
    logger.info(`Processing research query: "${query.substring(0, 50)}..."`);

    // 1. Validation Layer (AI Check)
    const validation = await validationService.validateQuery(query);

    if (!validation.isValid) {
      logger.warn(`Query blocked by AI Validator: ${validation.reason}`);
      return {
        answer: "عذراً، أنا متخصص فقط في الإجابة على الأسئلة المتعلقة بالتغذية والصحة.",
        sources: []
      };
    }

    try {
      // 2. Call Perplexity
      const contextEnhancedQuery = `${query}\n\n(Context: Please answer this professionally. Use formal Arabic if the question is in Arabic. Use Markdown tables for comparisons if relevant. Ensure the tone is expert yet accessible.)`;

      const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: contextEnhancedQuery }
      ];

      const { answer, citations } = await perplexityClient.chat(messages);

      // 3. Post-Processing
      
      // A. Source Filtering
      const HIGH_QUALITY_DOMAINS = [
        '.gov', '.edu', '.org', 
        'who.int', 'nih.gov', 'cdc.gov', 'nhs.uk', 'mayoclinic.org', 'clevelandclinic.org', 
        'harvard.edu', 'eatright.org', 'heart.org', 'medlineplus.gov', 'nutritioncare.org',
        'espen.org', 'wiley.com', 'sciencedirect.com', 'nature.com', 'bmj.com', 'lancet.com',
        'webmd.com', 'healthline.com', 'medicalnewstoday.com'
      ];

      const LOW_QUALITY_DOMAINS = [
        'youtube.com', 'youtu.be', 'facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com',
        'pinterest.com', 'linkedin.com', 'reddit.com', 'quora.com', 'scribd.com', 'slideshare.net',
        'blogspot.com', 'wordpress.com', 'medium.com'
      ];

      let filteredCitations = citations.filter(url => {
        const lowerUrl = url.toLowerCase();
        if (LOW_QUALITY_DOMAINS.some(domain => lowerUrl.includes(domain))) return false;
        return true;
      });

      const highQualityCitations = filteredCitations.filter(url => 
        HIGH_QUALITY_DOMAINS.some(domain => url.toLowerCase().includes(domain))
      );
      
      const otherCitations = filteredCitations.filter(url => 
        !HIGH_QUALITY_DOMAINS.some(domain => url.toLowerCase().includes(domain))
      );

      let finalCitations = [...highQualityCitations.slice(0, 4), ...otherCitations].slice(0, 5);
      
      if (finalCitations.length === 0 && citations.length > 0) {
        finalCitations = citations.slice(0, 3);
      }

      // B. Answer Cleanup and Enhancement
      let cleanedAnswer = answer;

      // Remove citation markers
      cleanedAnswer = cleanedAnswer.replace(/\[\d+(?:,\s*\d+)*\]/g, '');
      cleanedAnswer = cleanedAnswer.replace(/\[Source\s*\d+\]/gi, '').replace(/\(Source\s*\d+\)/gi, '');

      // Remove Roleplay / Filler Phrases
      const forbiddenPhrases = [
        "As a clinical dietitian", "In my clinic", "In my practice", "I advise my patients",
        "As an AI", "As a language model", "I am a nutrition assistant", "Based on my research",
        "According to the search results", "بناءً على بحثي", "بصفتي مساعد ذكاء اصطناعي", "أنا هنا للمساعدة"
      ];
      
      forbiddenPhrases.forEach(phrase => {
        const regex = new RegExp(phrase, 'gi');
        cleanedAnswer = cleanedAnswer.replace(regex, '');
      });

      // Trim extra spaces
      cleanedAnswer = cleanedAnswer.replace(/[ \t]{2,}/g, ' ').trim();

      // C. Add Medical Disclaimer
      const isArabic = /[\u0600-\u06FF]/.test(cleanedAnswer);
      const disclaimer = isArabic ? MEDICAL_DISCLAIMER_AR : MEDICAL_DISCLAIMER_EN;
      cleanedAnswer += disclaimer;

      logger.info(`Response processed. Length: ${cleanedAnswer.length} chars.`);

      return {
        answer: cleanedAnswer,
        sources: finalCitations
      };

    } catch (error: any) {
      logger.error(`Research Service Error: ${error.message}`);
      throw error;
    }
  }
}


export const researchService = new ResearchService();
