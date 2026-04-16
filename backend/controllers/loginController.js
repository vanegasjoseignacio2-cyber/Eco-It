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
            return res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }

        // Verificar si el usuario tiene contraseña (para evitar errores con usuarios de Google)
        if (!usuario.password) {
            return res.status(401).json({ 
                message: "Este usuario se registró con Google. Por favor, inicia sesión con Google." 
            });
        }

        // Comparar contraseñas
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }

        const token = jwt.sign(
            {
                id: usuario._id,
                rol: usuario.rol,
                perfilCompleto: usuario.perfilCompleto
            },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
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
                    rol: usuario.rol,
                    perfilCompleto: usuario.perfilCompleto
                }
            }
        });

    } catch (error) {
        console.error("❌ Error en loginUsuario:", error);
        res.status(500).json({
            message: "Error al iniciar sesión",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};