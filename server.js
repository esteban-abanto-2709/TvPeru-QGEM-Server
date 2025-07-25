const express = require('express');
const { Dropbox } = require('dropbox');
require('dotenv').config();

const DROPBOX_TOKEN = process.env.DROPBOX_TOKEN;
console.log('🔑 Dropbox Token cargado:', DROPBOX_TOKEN ? '✅ OK' : '❌ Faltante');

const dropbox = new Dropbox({ accessToken: DROPBOX_TOKEN });

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

async function subirADropbox(content, nameFile) {
  try {

    console.log('🔄 Intentando subir a Dropbox...');
    console.log('📁 Archivo:', nameFile);
    console.log('📊 Tamaño:', content.length, 'caracteres');

    const buffer = Buffer.from(content, 'utf8');
    console.log('🔄 Buffer creado, tamaño:', buffer.length);

    const response = await dropbox.filesUpload({
      path: '/CurrentData/' + nameFile,
      contents: buffer,
      mode: 'overwrite'
    });

    console.log('✅ Subido a Dropbox:', response.result.path_display);

  } catch (error) {

    console.error('❌ Error al subir a Dropbox:', error);
  }
}

// Endpoint para recibir los datos del Google Sheet
app.post('/api/save-data/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    // Log para debug
    console.log('📨 Request recibida desde:', req.headers['user-agent']);
    console.log('📦 Tamaño del body:', JSON.stringify(req.body).length);

    if (!filename || !filename.endsWith('.json')) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del archivo debe terminar en ".json"',
      });
    }

    // Validar que el body no esté vacío y sea válido
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El cuerpo de la petición está vacío'
      });
    }

    const content = JSON.stringify(req.body, null, 2);

    // Verificar que el content no tenga caracteres problemáticos
    const cleanContent = content.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

    if (cleanContent == content) {
      console.log('No se encontraron caracteres problemáticos en el contenido.');
    }

    await subirADropbox(content, filename);

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

app.get('/api/dropbox-check', async (req, res) => {
  try {
    const account = await dropbox.usersGetCurrentAccount();
    res.json({ success: true, account });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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