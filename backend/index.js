import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import { createServer } from 'http';
import { Server } from 'socket.io';
import User from './models/user.js';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { aiRouter } from './routes/aiRoutes.js';
import admin from './routes/admin.js';
import contactRoutes from './routes/contactRoutes.js';

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

// Mapa de usuarios conectados: userId → { nombre, sockets: Set<socketId> }
export const usuariosConectados = new Map();

io.on('connection', (socket) => {
    console.log('Socket conectado:', socket.id);

    // El cliente envía sus datos al conectarse
    socket.on('usuario:conectado', async (usuario) => {
        const userId = usuario._id;

        if (usuariosConectados.has(userId)) {
            // Ya existe: solo agrega el nuevo socketId (nueva pestaña)
            usuariosConectados.get(userId).sockets.add(socket.id);
        } else {
            // Usuario nuevo: crea su entrada
            usuariosConectados.set(userId, {
                nombre: usuario.nombre,
                sockets: new Set([socket.id])
            });
            // Notificar que se conectó en tiempo real
            io.emit('usuario:estado', { userId, isOnline: true });

            // Guardar la fecha de ultima conexion en la BD
            try {
                await User.findByIdAndUpdate(userId, { ultimaConexion: new Date() });
            } catch (e) {
                console.error('No se pudo actualizar ultimaConexion:', e.message);
            }
        }

        io.emit('usuarios:online', usuariosConectados.size);
        console.log(`${usuario.nombre} conectado. Total usuarios únicos: ${usuariosConectados.size}`);
    });

    // Al desconectarse
    socket.on('disconnect', () => {
        for (const [userId, data] of usuariosConectados.entries()) {
            if (data.sockets.has(socket.id)) {
                data.sockets.delete(socket.id);

                // Solo elimina al usuario si no tiene más pestañas abiertas
                if (data.sockets.size === 0) {
                    usuariosConectados.delete(userId);
                    console.log(`${data.nombre} desconectado totalmente.`);
                    // Notificar que se desconectó en tiempo real
                    io.emit('usuario:estado', { userId, isOnline: false });
                }

                io.emit('usuarios:online', usuariosConectados.size);
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;

// Inicializar Google OAuth
setupGoogleAuth();

// Middlewares globales
app.set('trust proxy', 1);
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
app.use('/api/ai', aiRouter );
app.use('/api/admin', admin);
app.use('/api/contact', contactRoutes);


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