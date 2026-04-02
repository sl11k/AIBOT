import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import chatRoutes from './modules/chat/chat.routes';
import { rateLimiter } from './middleware/rateLimit.middleware';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: '*', // Allow all origins for now, or specify client URL
  methods: ['GET', 'POST'],
}));
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Rate Limiting
app.use('/api', rateLimiter);

// Routes
app.use('/api/chat', chatRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling
app.use(errorHandler);

export default app;
