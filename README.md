# TV Perú - Que Gane El Mejor - App Center

## 📺 Descripción del Proyecto

**App Center** es el sistema centralizado para el programa "Que Gane El Mejor" de TV Perú. Este servidor web unifica todo el ecosistema de juegos y herramientas del programa, eliminando la dependencia de medios físicos como USB y facilitando la gestión de contenido en tiempo real.

## 🎯 Propósito

### Problemas que Resuelve

- **Eliminación de USB físicos**: Ya no es necesario transferir datos mediante dispositivos físicos
- **Gestión centralizada**: Todos los datos de juegos en un solo lugar
- **Acceso en tiempo real**: Los datos están disponibles instantáneamente para el sistema de transmisión en vivo
- **Versionado automático**: No más problemas de compatibilidad entre versiones del collector
- **Backup automático**: Protección de datos en la nube

### Funcionalidades Principales

1. **Almacenamiento de datos de juegos** (JSON)
2. **Hosting de demos de Unity** para pruebas
3. **Collector web** para que los docentes carguen datos directamente
4. **Sistema de archivos protegido** para resguardar el trabajo
5. **API REST** para integración con otros sistemas

## 🎮 Tipos de Juegos Soportados

- **Deletreo**: Juegos de ortografía y escritura
- **Operaciones Combinadas**: Matemática avanzada
- **Tres en Raya**: Juegos de estrategia
- **Y muchos más...**

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 18+
- MongoDB (local o en la nube)
- Puerto 3000 disponible

### Configuración

1- Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/TvPeru-QGEM-AppCenter.git
cd TvPeru-QGEM-AppCenter
```

2- Instala dependencias:

```bash
npm install
```

3- Configura las variables de entorno:

```bash
cp .env.example .env
```

4- Edita `.env` con tus datos de MongoDB:

``` env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/qgem_database?retryWrites=true&w=majority
```

5- Inicia el servidor:

```bash
# Producción
npm start

# Desarrollo
npm run dev
```

## 📡 API Endpoints

### Gestión de Archivos JSON

- `POST /api/save-data/:filename` - Guardar datos de juego
- `GET /api/load-data/:filename` - Cargar datos de juego  
- `GET /api/list-files` - Listar todos los archivos
- `DELETE /api/delete-data/:filename` - Eliminar archivo

### Monitoreo

- `GET /api/health` - Estado del servidor y base de datos
- `GET /` - Panel de control web

## 🔧 Estructura del Proyecto

``` cmd
TvPeru-QGEM-AppCenter/
├── src/
│   ├── config/          # Configuración de base de datos
│   ├── routes/          # Rutas de la API
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades (logger, etc)
│   ├── index.js         # Punto de entrada
│   └── server.js        # Configuración del servidor Express
├── public/              # Archivos estáticos (panel web)
├── data/               # Archivos JSON locales (ignorado en git)
└── package.json        # Dependencias y scripts

```

## 🎬 Flujo de Trabajo

1. **Docente** accede al collector web
2. **Docente** llena los datos de los juegos del día
3. **Sistema** guarda automáticamente en MongoDB
4. **Operador de TV** accede a los datos en tiempo real
5. **Sistema de transmisión** carga los juegos con la nueva data
6. **Al aire** se ejecutan los juegos con datos actualizados

## 🛡️ Seguridad

- Variables de entorno para datos sensibles
- Validación de datos JSON
- Backup automático en MongoDB
- Logs detallados de todas las operaciones

## 📋 Estado del Proyecto

- ✅ **Completado**: API REST para gestión de archivos JSON
- ✅ **Completado**: Panel web de monitoreo
- ✅ **Completado**: Integración con MongoDB
- 🔄 **En progreso**: Collector web para docentes
- 📅 **Planeado**: Hosting de demos de Unity
- 📅 **Planeado**: Sistema de autenticación

## 🤝 Contribución

Este proyecto es de uso interno para TV Perú - Programa "Que Gane El Mejor".

## 📞 Contacto

**Desarrollador**: Esteban Abanto Garcia  
**Email**: [esteban.abanto.2709@gmail.com](mailto:esteban.abanto.2709@gmail.com)  
**Programa**: Que Gane El Mejor  
**Canal**: TV Perú

---

Desarrollado con ❤️ para TV Perú
