const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para CORS (permitir requests desde Google Apps Script)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Endpoint para recibir los datos del Google Sheet
app.post('/api/save-data', (req, res) => {
  try {
    console.log('📥 Datos recibidos del Google Sheet:');
    console.log(JSON.stringify(req.body, null, 2));
    
    // Crear carpeta 'data' si no existe
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    // Guardar el JSON en un archivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `DeletreoData_${timestamp}.json`;
    const filepath = path.join(dataDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(req.body, null, 2));
    
    console.log(`✅ Archivo guardado: ${filename}`);
    
    res.status(200).json({
      success: true,
      message: 'Datos guardados correctamente',
      filename: filename,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error guardando datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Endpoint para verificar que el servidor funciona
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log('🚀 Servidor iniciado correctamente');
  console.log(`📡 Escuchando en: http://localhost:${PORT}`);
  console.log(`🔗 Endpoint para datos: http://localhost:${PORT}/api/save-data`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});