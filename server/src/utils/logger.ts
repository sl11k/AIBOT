// Simple logger utility
const log = (level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string, meta?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`, meta ? JSON.stringify(meta) : '');
};

export const logger = {
  info: (msg: string, meta?: any) => log('INFO', msg, meta),
  warn: (msg: string, meta?: any) => log('WARN', msg, meta),
  error: (msg: string, meta?: any) => log('ERROR', msg, meta),
  debug: (msg: string, meta?: any) => log('DEBUG', msg, meta),
};
