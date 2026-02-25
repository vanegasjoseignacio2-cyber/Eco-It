import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Iniciar sesión
export const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
        }

        // Buscar usuario por email (incluimos password por el select: false del modelo)
        const usuario = await User.findOne({ email }).select('+password');
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Comparar contraseñas
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generamos el token JWT
        const token = jwt.sign(
            {
                id: usuario._id,
                rol: usuario.rol,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Si todo es correcto
        res.status(200).json({
            message: "Inicio de sesión correcto",
            data: {
                token,
                usuario: {
                    id: usuario._id,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    edad: usuario.edad,
                    email: usuario.email,
                    telefono: usuario.telefono,
                    rol: usuario.rol
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al iniciar sesión",
            error: error.message,
        });
    }
};