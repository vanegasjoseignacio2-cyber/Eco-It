/**
 * Opciones de cookie JWT según el entorno.
 *
 * - Producción (NODE_ENV=production):
 *     Frontend (Netlify HTTPS) → Backend (Railway HTTPS) → cross-origin
 *     → necesita sameSite:'none' + secure:true
 *
 * - Desarrollo (localhost):
 *     Frontend (localhost:5173) → Vite proxy → Backend (localhost:3000) → mismo origen
 *     → sameSite:'lax' + secure:false funciona sin HTTPS
 */

export const cookieOptions = (maxAgeMs) => {
    // Evaluamos dinámicamente para asegurar que dotenv ya cargó las variables
    // Railway inyecta RAILWAY_ENVIRONMENT o RAILWAY_PROJECT_ID automáticamente
    const isProd = process.env.NODE_ENV === 'production' || 
                   process.env.RAILWAY_ENVIRONMENT === 'production' ||
                   !!process.env.RAILWAY_PROJECT_ID ||
                   (process.env.FRONT_URL && process.env.FRONT_URL.startsWith('https://')) ||
                   (process.env.BACK_URL && process.env.BACK_URL.startsWith('https://'));

    return {
        httpOnly: true,
        secure: isProd,              // true en Railway (HTTPS), false en localhost (HTTP)
        sameSite: isProd ? 'none' : 'lax', // 'none' requiere cross-origin; 'lax' para mismo origen
        maxAge: maxAgeMs,
    };
};

export const clearCookieOptions = () => {
    const isProd = process.env.NODE_ENV === 'production' || 
                   process.env.RAILWAY_ENVIRONMENT === 'production' ||
                   !!process.env.RAILWAY_PROJECT_ID ||
                   (process.env.FRONT_URL && process.env.FRONT_URL.startsWith('https://')) ||
                   (process.env.BACK_URL && process.env.BACK_URL.startsWith('https://'));

    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
    };
};
