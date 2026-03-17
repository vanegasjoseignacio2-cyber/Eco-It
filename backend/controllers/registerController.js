import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from '../utils/emailService.js';

// Crear usuarios
export const registrarUser = async (req, res) => {
  try {
    const { nombre, apellido, edad, email, telefono, password } = req.body;

    // Validar campos
    if (!nombre || !apellido || !edad || !email || !telefono || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const existeUser = await User.findOne({ email });
    if (existeUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Crear el nuevo usuario (el modelo hashea la contraseña automáticamente via pre-save)
    const nuevoUser = new User({
      nombre,
      apellido,
      edad,
      email,
      telefono,
      password,
      rol: 'user',
      perfilCompleto: true
    });

    await nuevoUser.save();

    sendWelcomeEmail(nuevoUser.email, nuevoUser.nombre)
      .catch(err => console.error('Error al enviar bienvenida:', err));

    // Generar token JWT igual que el login
    const token = jwt.sign(
      { id: nuevoUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      data: {
        token,
        usuario: {
          id: nuevoUser._id,
          nombre: nuevoUser.nombre,
          apellido: nuevoUser.apellido,
          email: nuevoUser.email,
          telefono: nuevoUser.telefono,
          edad: nuevoUser.edad,
        }
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
};
