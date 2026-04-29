import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { globalLimiter } from './middlewares/limiters.js';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import { createServer } from 'http';
import { Server } from 'socket.io';
import User from './models/user.js';

// Los limitadores se importan desde ./middlewares/limiters.js

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { aiRouter } from './routes/aiRoutes.js';
import admin from './routes/admin.js';
import contactRoutes from './routes/contactRoutes.js';
import carouselRoutes from './routes/carouselRoutes.js';
import mapPublicRoutes from './routes/map.js';
import './utils/cloudinary.js';

// Importar configuración de passport
import { setupGoogleAuth } from './controllers/AutheticationGoogle.js';

// Crear aplicación Express
const app = express();
const httpServer = createServer(app);

// Configurar Socket.io
export const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://eco-it.netlify.app'],
        methods: ['GET', 'POST']
    }
});

// Middleware de autenticación para Socket.io
io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
        console.log('Socket connection denied: No token provided');
        return next(new Error('Authentication error: Token required'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.usuario = decoded;
        next();
    } catch (err) {
        console.log('Socket connection denied: Invalid token');
        next(new Error('Authentication error: Invalid token'));
    }
});

// Mapa de usuarios conectados: userId → { nombre, sockets: Set<socketId> }
export const usuariosConectados = new Map();

io.on('connection', (socket) => {
    console.log('Socket conectado:', socket.id);

    // Al conectarse totalmente tras el handshake exitoso
    socket.on('usuario:conectado', async () => {
        // Usamos la información del token verificado en el middleware (socket.usuario)
        const userId = socket.usuario.id;
        const nombre = socket.usuario.nombre || 'Usuario';

        if (usuariosConectados.has(userId)) {
            // Ya existe: solo agrega el nuevo socketId (nueva pestaña)
            usuariosConectados.get(userId).sockets.add(socket.id);
        } else {
            // Usuario nuevo: crea su entrada
            usuariosConectados.set(userId, {
                nombre: nombre,
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

        // Refrescar el rol desde la BD para asegurar permisos actuales
        try {
            const userInDb = await User.findById(userId).select('rol');
            if (userInDb && (userInDb.rol === 'admin' || userInDb.rol === 'superadmin')) {
                socket.join('admins');
                console.log(`Socket ${socket.id} unido a sala 'admins' (Rol: ${userInDb.rol})`);
            }
        } catch (e) {
            console.error('Error al verificar rol para sala admins:', e.message);
        }

        io.emit('usuarios:online', usuariosConectados.size);
        console.log(`${nombre} conectado. Total usuarios únicos: ${usuariosConectados.size}`);
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

// Seguridad HTTP con Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https://res.cloudinary.com", "https://*.tile.openstreetmap.org"],
            "script-src": ["'self'", "'unsafe-inline'"], // unsafe-inline es a veces necesario para React, pero se puede restringir más
            "connect-src": ["'self'", "https://api.cloudinary.com", "wss://*.openrouter.ai"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// Restricción de CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://eco-it.netlify.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.set("io", io); // Hacer Socket.io disponible en las rutas

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Saneamiento contra inyección NoSQL — compatible con Express 5
// express-mongo-sanitize@2.2.0 intenta reasignar req.query (ahora solo-lectura en Express 5),
// por lo que sanitizamos req.body y req.params manualmente.
app.use((req, res, next) => {
    if (req.body) req.body = mongoSanitize.sanitize(req.body);
    if (req.params) req.params = mongoSanitize.sanitize(req.params);
    next();
});

// Aplicar Rate Limiting global
app.use(globalLimiter);

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
app.use('/api/carousel', carouselRoutes);
app.use('/api/map', mapPublicRoutes);


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