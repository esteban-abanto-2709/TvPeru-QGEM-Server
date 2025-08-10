import { getDatabase } from '../config/database.js';
import { logger } from '../utils/logger.js';

const COLLECTION_NAME = 'json_files';

export class JsonStorageService {

  static getCollection() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME);
  }

  /**
   * Guarda un archivo JSON en MongoDB
   * @param {string} filename - Nombre del archivo (ej: "DeletreoData.json")
   * @param {Object} jsonData - Datos JSON a guardar
   * @returns {Object} Resultado de la operación
   */
  static async saveJsonFile(filename, jsonData) {
    try {
      const collection = this.getCollection();

      const document = {
        filename: filename,
        data: jsonData,
        size: JSON.stringify(jsonData).length,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Usar upsert para actualizar si existe o crear si no existe
      const result = await collection.replaceOne(
        { filename: filename },
        document,
        { upsert: true }
      );

      logger.info('JsonStorage', `📁 Archivo guardado: ${filename} (${document.size} bytes)`);

      return {
        success: true,
        filename: filename,
        operation: result.upsertedId ? 'created' : 'updated',
        size: document.size,
        timestamp: document.updatedAt
      };

    } catch (error) {
      logger.error('JsonStorage', `Error guardando ${filename}`, error);
      throw error;
    }
  }

  /**
   * Carga un archivo JSON desde MongoDB
   * @param {string} filename - Nombre del archivo a cargar
   * @returns {Object} Datos del archivo
   */
  static async loadJsonFile(filename) {
    try {
      const collection = this.getCollection();

      const document = await collection.findOne({ filename: filename });

      if (!document) {
        throw new Error(`Archivo no encontrado: ${filename}`);
      }

      logger.info('JsonStorage', `📂 Archivo cargado: ${filename} (${document.size} bytes)`);

      return {
        success: true,
        filename: filename,
        data: document.data,
        size: document.size,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt
      };

    } catch (error) {
      logger.error('JsonStorage', `Error cargando ${filename}`, error);
      throw error;
    }
  }

  /**
   * Lista todos los archivos JSON disponibles
   * @returns {Array} Lista de archivos
   */
  static async listJsonFiles() {
    try {
      const collection = this.getCollection();

      const files = await collection.find({}, {
        projection: {
          filename: 1,
          size: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }).toArray();

      logger.info('JsonStorage', `📋 Listando ${files.length} archivos`);

      return {
        success: true,
        files: files.map(f => ({
          filename: f.filename,
          size: f.size,
          createdAt: f.createdAt,
          updatedAt: f.updatedAt
        }))
      };

    } catch (error) {
      logger.error('JsonStorage', 'Error listando archivos', error);
      throw error;
    }
  }

  /**
   * Elimina un archivo JSON
   * @param {string} filename - Nombre del archivo a eliminar
   * @returns {Object} Resultado de la operación
   */
  static async deleteJsonFile(filename) {
    try {
      const collection = this.getCollection();

      const result = await collection.deleteOne({ filename: filename });

      if (result.deletedCount === 0) {
        throw new Error(`Archivo no encontrado: ${filename}`);
      }

      logger.info('JsonStorage', `🗑️ Archivo eliminado: ${filename}`);

      return {
        success: true,
        filename: filename,
        deleted: true
      };

    } catch (error) {
      logger.error('JsonStorage', `Error eliminando ${filename}`, error);
      throw error;
    }
  }
}