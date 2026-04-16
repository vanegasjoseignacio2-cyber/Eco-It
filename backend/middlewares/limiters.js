import { rateLimit } from 'express-rate-limit';

// Limiter global (Antispam y Anti-DDoS)
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 300, // límite de 300 peticiones por IP
    standardHeaders: true, 
    legacyHeaders: false,
    message: {
        success: false,
        mensaje: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.'
    }
});

// Limiter más estricto para autenticación (Prevención de fuerza bruta)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 15, // máximo 15 peticiones por IP para login/registro
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        mensaje: 'Demasiados intentos de acceso desde esta IP. Por favor, intenta de nuevo en 15 minutos.'
    }
});
