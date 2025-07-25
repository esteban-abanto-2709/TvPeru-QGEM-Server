const express = require('express');
const { Dropbox } = require('dropbox');
require('dotenv').config();

const DROPBOX_TOKEN = process.env.DROPBOX_TOKEN;
console.log('🔑 Dropbox Token cargado:', DROPBOX_TOKEN ? '✅ OK' : '❌ Faltante');

const dropbox = new Dropbox({ accessToken: DROPBOX_TOKEN });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Middleware para CORS (permitir requests desde Google Apps Script)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Página principal para mantener el servidor activo
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Endpoint para recibir los datos del Google Sheet
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

    if (cleanContent !== content) {
      console.log('⚠️ Se encontraron caracteres problemáticos en el contenido.');
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

// Health check unificado - verifica servidor Y Dropbox
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión con Dropbox
    const account = await dropbox.usersGetCurrentAccount();

    res.json({
      success: true,
      server: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      },
      dropbox: {
        connected: true,
        account: {
          account_id: account.result.account_id,
          name: account.result.name,
          email: account.result.email
        }
      }
    });

  } catch (error) {
    console.error('❌ Error en health check:', error);
    res.status(500).json({
      success: false,
      server: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      },
      dropbox: {
        connected: false,
        error: error.message
      }
    });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  // Detectar el entorno y construir la URL base
  const isRender = process.env.RENDER;
  const renderUrl = process.env.RENDER_EXTERNAL_URL;
  
  let baseUrl;
  if (isRender && renderUrl) {
    baseUrl = renderUrl;
  } else if (process.env.NODE_ENV === 'production') {
    baseUrl = `https://tu-app-render.onrender.com`; // Cambiar por tu URL real
  } else {
    baseUrl = `http://localhost:${PORT}`;
  }

  console.log('🚀 Servidor iniciado correctamente');
  console.log(`📡 Escuchando en puerto: ${PORT}`);
  console.log(`🌐 Página principal: ${baseUrl}`);
  console.log(`🔗 Endpoint para datos: ${baseUrl}/api/save-data`);
  console.log(`❤️  Health check: ${baseUrl}/api/health`);
});