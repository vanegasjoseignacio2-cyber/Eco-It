import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../utils/emailService.js';

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
    const { nombre, apellido, email, telefono, password, edad } = req.body;

    // 1. Validar campos obligatorios
    if (!nombre || !apellido || !email || !telefono || !password || !edad) {
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
      password,
      edad
    });

    // 4. Enviar correo de bienvenida (No bloqueante)
    sendWelcomeEmail(usuario.email, usuario.nombre)
      .catch(err => console.error('Error al enviar bienvenida:', err));

    // 5. Generar token
    const token = generarToken(usuario._id);

    // 6. Responder con éxito
    res.status(201).json({
      success: true,
      mensaje: 'Usuario registrado exitosamente',
      data: {
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          telefono: usuario.telefono,
          edad: usuario.edad
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