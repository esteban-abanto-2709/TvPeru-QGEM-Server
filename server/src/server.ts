import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './utils/logger.js';
import { connectToDatabase, getDatabase } from './config/database.js';
import { apiRoutes } from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json({ limit: '10mb' })); // Permitir JSONs grandes
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
app.use('/api', apiRoutes);

// Ruta principal - servir HTML desde public/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  logger.info('Server', 'Health check requested');

  try {
    const db = getDatabase();
    await db.admin().ping();

    res.json({
      success: true,
      server: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      },
      database: {
        connected: true,
        status: 'OK'
      }
    });
  } catch (error) {
    logger.error('Server', 'Database connection failed in health check', error);
    res.json({
      success: true,
      server: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      },
      database: {
        connected: false,
        status: 'ERROR',
        error: error.message
      }
    });
  }
});

export async function startServer(port) {
  try {
    // 1. Conectar a base de datos
    logger.info('Server', '🔄 Conectando a MongoDB...');
    await connectToDatabase();

    // 2. Iniciar servidor HTTP
    return new Promise((resolve, reject) => {
      const server = app.listen(port, () => {
        logger.info('Server', `✅ Server listening on port ${port}`);
        resolve(server);
      });

      server.on('error', (error) => {
        logger.error('Server', 'Failed to start server', error);
        reject(error);
      });
    });

  } catch (error) {
    logger.error('Server', 'Error during server startup', error);
    throw error;
  }
}
