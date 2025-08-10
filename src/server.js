import express from 'express';
import { logger } from './utils/logger.js';
import { connectToDatabase, getDatabase } from './config/database.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  logger.info('Server', 'Home page requested');

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Servidor Funcionando</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                margin-top: 50px; 
                background-color: #f0f0f0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #28a745; }
            p { color: #666; font-size: 18px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>✅ Servidor Funcionando</h1>
            <p>El servidor está activo y funcionando correctamente.</p>
            <p>Puerto: ${process.env.PORT || 3000}</p>
            <p>Hora: ${new Date().toLocaleString()}</p>
            <p>Ambiente: ${process.env.NODE_ENV || 'development'}</p>
        </div>
    </body>
    </html>
  `);
});

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
    logger.info('Server', '🔄 Iniciando conexiones...');
    await connectToDatabase();

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