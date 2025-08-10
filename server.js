const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta principal - página simple
app.get('/', (req, res) => {
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
            <p>Puerto: ${PORT}</p>
            <p>Hora: ${new Date().toLocaleString()}</p>
        </div>
    </body>
    </html>
  `);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`🌐 Acceder en: http://localhost:${PORT}`);
});