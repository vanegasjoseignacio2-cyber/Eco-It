import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Middleware que protege rutas
export const proteger = async (req, res, next) => {
  try {
    let token;

    // 1. Verificar si el token viene en los headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // El token viene así: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      // Extraemos solo el token (quitamos "Bearer ")
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Si no hay token, denegar acceso
    if (!token) {
      return res.status(401).json({
        success: false,
        mensaje: 'No autorizado - Token no proporcionado'
      });
    }

    // 3. Verificar que el token sea válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Buscar el usuario en la base de datos
    req.usuario = await User.findById(decoded.id).select('-password');

    // 5. Si el usuario no existe
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // 6. Todo bien, continuar con la petición
    next();

  } catch (error) {
    console.error('Error en middleware proteger:', error);
    res.status(401).json({
      success: false,
      mensaje: 'Token inválido o expirado'
    });
  }
};