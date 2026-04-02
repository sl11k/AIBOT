import { researchService } from '../../services/research.service';
import { logger } from '../../utils/logger';

export class ChatService {
  /**
   * Process a chat message from the user.
   * Currently delegates to the Research Service for Perplexity-based answers.
   */
  public async processMessage(message: string) {
    logger.info(`ChatService processing message: ${message.substring(0, 20)}...`);
    return await researchService.research(message);
  }
}

export const chatService = new ChatService();
