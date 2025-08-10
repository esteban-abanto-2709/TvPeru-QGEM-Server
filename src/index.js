import dotenv from 'dotenv';
import { startServer } from './server.js';
import { logger } from './utils/logger.js';

dotenv.config();

async function main() {
  try {
    const PORT = parseInt(process.env.PORT || '3000', 10);

    if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
      throw new Error(`Invalid port: ${process.env.PORT}. Must be a number between 1 and 65535`);
    }

    logger.info('App', '🚀 Starting Deletreo Server...');
    logger.info('Config', `Port: ${PORT}`);
    logger.info('Config', `Environment: ${process.env.NODE_ENV || 'development'}`);

    await startServer(PORT);

    logger.info('App', '✅ Deletreo Server started successfully!');
    logger.info('App', `🌐 Server running on http://localhost:${PORT}`);
    logger.info('App', `📊 Health check: http://localhost:${PORT}/api/health`);

  } catch (error) {
    logger.error('App', 'Failed to start application', error);
    process.exit(1);
  }
}

main();

export { main };