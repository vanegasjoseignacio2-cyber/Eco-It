import User from '../models/user.js';
import bcrypt from 'bcryptjs';

// Controlador: Obtener perfil del usuario autenticado
export const obtenerPerfil = async (req, res) => {
  try {
    // req.usuario viene del middleware de autenticación
    const usuario = await User.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        edad: usuario.edad,
        avatar: usuario.avatar,
        createdAt: usuario.createdAt
      }
    });

  } catch (error) {
    console.error('Error en obtenerPerfil:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener perfil',
      error: error.message
    });
  }
};

// Controlador: Actualizar perfil
export const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, apellido, telefono, avatar, edad } = req.body;

    // Buscar usuario
    const usuario = await User.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Actualizar solo los campos que vienen en el body
    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;
    if (telefono) usuario.telefono = telefono;
    if (avatar) usuario.avatar = avatar;
    if (edad) usuario.edad = edad;

    // Guardar cambios
    await usuario.save();

    res.status(200).json({
      success: true,
      mensaje: 'Perfil actualizado exitosamente',
      data: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        edad: usuario.edad,
        avatar: usuario.avatar
      }
    });

  } catch (error) {
    console.error('Error en actualizarPerfil:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

// Controlador: Cambiar contraseña
export const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;

    // 1. Validar que vengan ambas contraseñas
    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({
        success: false,
        mensaje: 'Debes proporcionar la contraseña actual y la nueva'
      });
    }

    // 2. Validar longitud de la nueva contraseña
    if (passwordNueva.length < 8) {
      return res.status(400).json({
        success: false,
        mensaje: 'La nueva contraseña debe tener al menos 8 caracteres'
      });
    }

    // 3. Buscar usuario con password
    const usuario = await User.findById(req.usuario.id).select('+password');

    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // 4. Verificar que la contraseña actual sea correcta
    const passwordCorrecta = await usuario.compararPassword(passwordActual);

    if (!passwordCorrecta) {
      return res.status(401).json({
        success: false,
        mensaje: 'La contraseña actual es incorrecta'
      });
    }

    // 5. Actualizar contraseña (se encriptará automáticamente con el middleware)
    usuario.password = passwordNueva;
    await usuario.save();

    res.status(200).json({
      success: true,
      mensaje: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error en cambiarPassword:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al cambiar contraseña',
      error: error.message
    });
  }
};