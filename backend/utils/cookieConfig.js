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

const isProd = process.env.NODE_ENV === 'production';

export const cookieOptions = (maxAgeMs) => ({
    httpOnly: true,
    secure: isProd,              // true en Railway (HTTPS), false en localhost (HTTP)
    sameSite: isProd ? 'none' : 'lax', // 'none' requiere cross-origin; 'lax' para mismo origen
    maxAge: maxAgeMs,
});

export const clearCookieOptions = () => ({
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
});
