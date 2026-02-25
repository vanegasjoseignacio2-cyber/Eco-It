import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import admin from './routes/admin.js';

// Configurar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());  // Permitir peticiones desde el frontend
app.use(express.json({ limit: '10mb' }));  // Parsear JSON (límite para imágenes base64)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

// Rutas de la API
app.use('/api/auth', authRoutes);      // Rutas de autenticación (registro, login)
app.use('/api/user', userRoutes);      // Rutas de usuario (perfil, editar)
app.use('/api/ai', aiRoutes);          // Rutas de IA (consultar, analizar imagen)
app.use('/api/admin', admin);          // Rutas de administrador

// Ruta raíz (para verificar que el servidor funciona)
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    mensaje: 'API de Eco-It funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      ai: '/api/ai'
    }
  });
});

// Ruta para manejar endpoints no encontrados (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: 'Endpoint no encontrado',
    ruta: req.originalUrl
  });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(err.status || 500).json({
    success: false,
    mensaje: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación de endpoints:`);
  console.log(`   - POST /api/auth/registro`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/user/perfil`);
  console.log(`   - PUT  /api/user/perfil`);
  console.log(`   - PUT  /api/user/cambiar-password`);
  console.log(`   - POST /api/ai/consultar`);
  console.log(`   - POST /api/ai/analizar-imagen`);
  console.log(`   - GET  /api/ai/sugerencias\n`);
});