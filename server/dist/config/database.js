import { MongoClient } from 'mongodb';
import { logger } from '../utils/logger.js';
let client = null;
let db = null;
export async function connectToDatabase() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI no está definida en las variables de entorno');
        }
        logger.info('Database', '🔄 Conectando a MongoDB...');
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        // Obtener el nombre de la base de datos de la URI
        const dbName = new URL(process.env.MONGODB_URI).pathname.slice(1).split('?')[0];
        db = client.db(dbName);
        // Hacer ping para verificar la conexión
        await db.admin().ping();
        logger.info('Database', `✅ Conectado exitosamente a MongoDB: ${dbName}`);
        return db;
    }
    catch (error) {
        logger.error('Database', 'Error conectando a MongoDB', error);
        throw error;
    }
}
export async function disconnectFromDatabase() {
    try {
        if (client) {
            await client.close();
            logger.info('Database', '🔌 Desconectado de MongoDB');
        }
    }
    catch (error) {
        logger.error('Database', 'Error desconectando de MongoDB', error);
    }
}
export function getDatabase() {
    if (!db) {
        throw new Error('Base de datos no conectada. Llama a connectToDatabase() primero.');
    }
    return db;
}
// Manejar cierre de la aplicación
process.on('SIGINT', async () => {
    await disconnectFromDatabase();
    process.exit(0);
});
