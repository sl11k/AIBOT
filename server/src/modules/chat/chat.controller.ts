import { Request, Response, NextFunction } from 'express';
import { chatService } from './chat.service';
import { isNutritionDomain } from './chat.validation';
import { logger } from '../../utils/logger';

export const chatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;

    // 1. Validate input (already validated by Zod middleware, but let's double check content)
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // 2. Validate domain (Delegated to Service Layer for AI Check)
    // We skipped the simple keyword check to allow more nuanced queries (e.g. "client progress").
    
    // 3. Call chat service
    const result = await chatService.processMessage(message);

    // 4. Return formatted response
    return res.status(200).json({
      answer: result.answer,
      sources: result.sources
    });

  } catch (error: any) {
    next(error);
  }
};
