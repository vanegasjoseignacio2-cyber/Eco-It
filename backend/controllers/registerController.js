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

// Controlador: Registrar nuevo usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, password } = req.body;

    // 1. Validar campos obligatorios
    if (!nombre || !apellido || !email || !telefono || !password) {
      return res.status(400).json({
        success: false,
        mensaje: 'Todos los campos son obligatorios'
      });
    }

    // 2. Verificar si el email ya existe
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        mensaje: 'El email ya está registrado'
      });
    }

    // 3. Crear nuevo usuario
    const usuario = await User.create({
      nombre,
      apellido,
      email,
      telefono,
      password
    });

    // 4. Generar token
    const token = generarToken(usuario._id);

    // 5. Responder con éxito
    res.status(201).json({
      success: true,
      mensaje: 'Usuario registrado exitosamente',
      data: {
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          telefono: usuario.telefono
        },
        token
      }
    });

  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
};