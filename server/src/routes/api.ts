import express from 'express';
import { JsonStorageService } from '../services/jsonStorage.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Guardar archivo JSON
router.post('/save-data/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const jsonData = req.body;

    // Validaciones básicas
    if (!filename.endsWith('.json')) {
      return res.status(400).json({
        success: false,
        error: 'El filename debe terminar en .json'
      });
    }

    if (!jsonData || typeof jsonData !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Se requiere un JSON válido en el body'
      });
    }

    const result = await JsonStorageService.saveJsonFile(filename, jsonData);
    res.json(result);

  } catch (error) {
    logger.error('API', `Error en save-data/${req.params.filename}`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cargar archivo JSON - SOLO DATOS (para Unity/C#)
router.get('/load-data/:filename', async (req, res) => {
  const { filename } = req.params;

  try {
    const result = await JsonStorageService.loadJsonFile(filename);
    res.json(result.data);

  } catch (error) {
    if (error.message.includes('no encontrado')) {
      res.status(404).json({
        error: `Archivo no encontrado: ${filename}`
      });
    } else {
      logger.error('API', `Error en load-data/${filename}`, error);
      res.status(500).json({
        error: error.message
      });
    }
  }
});

// Cargar archivo JSON - CON DETALLES (para administración/web)
router.get('/load-data/details/:filename', async (req, res) => {
  const { filename } = req.params;

  try {
    const result = await JsonStorageService.loadJsonFile(filename);
    res.json(result);

  } catch (error) {
    if (error.message.includes('no encontrado')) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else {
      logger.error('API', `Error en load-data/details/${filename}`, error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

// Listar archivos
router.get('/list-files', async (req, res) => {
  try {
    const result = await JsonStorageService.listJsonFiles();
    res.json(result);

  } catch (error) {
    logger.error('API', 'Error en list-files', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Eliminar archivo
router.delete('/delete-data/:filename', async (req, res) => {
  const { filename } = req.params;

  try {
    const result = await JsonStorageService.deleteJsonFile(filename);
    res.json(result);

  } catch (error) {
    if (error.message.includes('no encontrado')) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else {
      logger.error('API', `Error en delete-data/${filename}`, error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

export { router as apiRoutes };
