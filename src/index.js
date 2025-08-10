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

    logger.info('App', '🚀 Iniciando TV Perú - QGEM App Center...');
    logger.info('Config', `Puerto: ${PORT}`);

    await startServer(PORT);

    logger.info('App', '✅ QGEM App Center iniciado exitosamente!');
    logger.info('App', `🌐 Servidor ejecutándose en http://localhost:${PORT}`);
    logger.info('App', `📊 Monitoreo de salud: http://localhost:${PORT}/api/health`);
    logger.info('App', '🎬 Listo para recibir datos del programa "Que Gane El Mejor"');

  } catch (error) {
    logger.error('App', 'Error al iniciar la aplicación', error);
    process.exit(1);
  }
}

main();

export { main };