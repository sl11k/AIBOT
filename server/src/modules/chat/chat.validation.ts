import { z } from 'zod';
import { NUTRITION_KEYWORDS } from '../../config/constants';

export const chatSchema = z.object({
  body: z.object({
    message: z.string({
      required_error: 'Message is required',
    })
    .min(3, 'Message must be at least 3 characters long')
    .max(500, 'Message cannot exceed 500 characters')
    .trim(),
  }),
});

// Domain validation function (helper for controller)
export function isNutritionDomain(message: string): boolean {
  if (!message) return false;
  const lowerMsg = message.toLowerCase();
  return NUTRITION_KEYWORDS.some(keyword => lowerMsg.includes(keyword));
}
