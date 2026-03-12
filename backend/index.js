// ⚠️ dotenv MUST be configured first, before any other imports that read env vars
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import admin from './routes/admin.js';
import googleAuthRoutes from './routes/googleAuthRoutes.js';

// Importar configuración de passport
import { setupGoogleAuth } from './controllers/AutheticationGoogle.js';

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Google OAuth (debe llamarse DESPUÉS de que dotenv ya cargó las variables)
setupGoogleAuth();

// Middlewares globales
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sesión y Passport (necesario para Google OAuth)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

// Rutas de la API
app.use('/api/auth', authRoutes);      // Rutas de autenticación (registro, login)
app.use('/api/auth', googleAuthRoutes); // Rutas de Google OAuth
app.use('/api/user', userRoutes);      // Rutas de usuario (perfil, editar, recuperación)
app.use('/api/ai', aiRoutes);          // Rutas de IA (consultar, analizar imagen)
app.use('/api/admin', admin);          // Rutas de administrador

// Ruta raíz
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

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: 'Endpoint no encontrado',
    ruta: req.originalUrl
  });
});

// Error global
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
  console.log(`   - POST /api/user/recuperar-password`);
  console.log(`   - POST /api/user/verificar-codigo`);
  console.log(`   - POST /api/user/restablecer-password`);
  console.log(`   - GET  /api/user/perfil`);
  console.log(`   - PUT  /api/user/perfil`);
  console.log(`   - PUT  /api/user/cambiar-password`);
  console.log(`   - POST /api/ai/consultar`);
  console.log(`   - POST /api/ai/analizar-imagen`);
  console.log(`   - GET  /api/ai/sugerencias\n`);
});