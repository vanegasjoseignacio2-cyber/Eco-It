import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import admin from './routes/admin.js';

// Importar configuración de passport
import { setupGoogleAuth } from './controllers/AutheticationGoogle.js';

// Crear aplicación Express
const app = express();
const httpServer = createServer(app);

// Configurar Socket.io
export const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Mapa de usuarios conectados: socketId → { userId, nombre }
export const usuariosConectados = new Map();

io.on('connection', (socket) => {
    console.log('Socket conectado:', socket.id);

    // El cliente envía sus datos al conectarse
    socket.on('usuario:conectado', (usuario) => {
        usuariosConectados.set(socket.id, {
            userId: usuario._id,
            nombre: usuario.nombre
        });
        // Emitir conteo actualizado a todos
        io.emit('usuarios:online', usuariosConectados.size);
        console.log(`${usuario.nombre} conectado. Total: ${usuariosConectados.size}`);
    });

    // Al desconectarse
    socket.on('disconnect', () => {
        const usuario = usuariosConectados.get(socket.id);
        usuariosConectados.delete(socket.id);
        io.emit('usuarios:online', usuariosConectados.size);
        console.log(`${usuario?.nombre || 'Anónimo'} desconectado. Total: ${usuariosConectados.size}`);
    });
});

const PORT = process.env.PORT || 3000;

// Inicializar Google OAuth
setupGoogleAuth();

// Middlewares globales
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sesión y Passport
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
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', admin);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        success: true,
        mensaje: 'API de Eco-It funcionando correctamente',
        version: '1.0.0'
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

// Iniciar servidor con httpServer en vez de app
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Socket.io activo\n`);
});