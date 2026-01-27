import User from '../models/user.js';
import jwt from 'jsonwebtoken';

// Función para generar token JWT
const generarToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Controlador: Iniciar sesión
export const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        mensaje: 'Email y contraseña son obligatorios'
      });
    }

    // 2. Buscar usuario (incluir password)
    const usuario = await User.findOne({ email }).select('+password');

    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // 3. Verificar contraseña
    const passwordCorrecta = await usuario.compararPassword(password);

    if (!passwordCorrecta) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // 4. Generar token
    const token = generarToken(usuario._id);

    // 5. Responder
    res.status(200).json({
      success: true,
      mensaje: 'Inicio de sesión exitoso',
      data: {
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          telefono: usuario.telefono,
          avatar: usuario.avatar,
          edad: usuario.edad
        },
        token
      }
    });

  } catch (error) {
    console.error('Error en iniciarSesion:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al iniciar sesión',
      error: error.message
    });
  }
};