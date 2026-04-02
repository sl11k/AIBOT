import { Router } from 'express';
import { chatController } from './chat.controller';
import { validate } from '../../middleware/validate.middleware';
import { chatSchema } from './chat.validation';

const router = Router();

// POST /api/chat
router.post('/', validate(chatSchema), chatController);

export default router;
