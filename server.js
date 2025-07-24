const express = require('express');
const fs = require('fs');
const path = require('path');
const { Dropbox } = require('dropbox');
require('dotenv').config();

const DROPBOX_TOKEN = process.env.DROPBOX_TOKEN;
console.log('🔑 Dropbox Token: ', DROPBOX_TOKEN);

const dropbox = new Dropbox({ accessToken: DROPBOX_TOKEN });

async function subirADropbox(rutaLocal, nombreEnDropbox) {
  const contenido = fs.readFileSync(rutaLocal);

  try {
    const response = await dropbox.filesUpload({
      path: '/' + nombreEnDropbox,
      contents: contenido,
      mode: 'overwrite'
    });

    console.log('✅ Subido a Dropbox:', response.result.path_display);
  } catch (error) {
    console.error('❌ Error al subir a Dropbox:', error);
  }
}

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
app.post('/api/save-data', async (req, res) => {
  try {
    console.log('📥 Datos recibidos del Google Sheet:');
    console.log(JSON.stringify(req.body, null, 2));
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `DeletreoData_${timestamp}.json`;
    const content = JSON.stringify(req.body, null, 2);
    
    // Guardar localmente (backup - temporary)
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    const filepath = path.join(dataDir, filename);
    fs.writeFileSync(filepath, content);
    console.log(`💾 Backup local guardado: ${filename}`);

    // Subir a Dropbox
    await subirADropbox(filepath, filename);
    
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

// 🧪 ENDPOINT DE PRUEBA - Para testear desde tu PC
app.post('/api/test', async (req, res) => {
  try {
    console.log('🧪 MODO PRUEBA ACTIVADO');
    
    // Datos de prueba simulando el formato del Google Sheet
    const datosDeEjemplo = {
      "generatedAt": new Date().toISOString(),
      "groups": [
        {
          "words": ["casa", "perro", "gato", "mesa", "silla"]
        },
        {
          "words": ["azul", "rojo", "verde", "amarillo"]
        },
        {
          "words": ["correr", "saltar", "caminar"]
        }
      ]
    };
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `TEST_DeletreoData_${timestamp}.json`;
    const content = JSON.stringify(datosDeEjemplo, null, 2);
    
    console.log('🧪 Datos de prueba generados:');
    console.log(content);
    
    // Guardar localmente
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    const filepath = path.join(dataDir, filename);
    fs.writeFileSync(filepath, content);
    console.log(`💾 Archivo de prueba guardado localmente: ${filename}`);
    
    // Subir a Dropbox
    await subirADropbox(filepath, filename);
    
    res.status(200).json({
      success: true,
      message: '🧪 Prueba completada exitosamente',
      filename: filename,
      testMode: true,
      timestamp: new Date().toISOString(),
      sampleData: datosDeEjemplo
    });
    
  } catch (error) {
    console.error('❌ Error en modo prueba:', error);
    res.status(500).json({
      success: false,
      message: 'Error en modo prueba',
      error: error.message,
      testMode: true
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