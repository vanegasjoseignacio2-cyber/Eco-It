import User from '../models/user.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { registrarUser } from '../controllers/registerController.js';
import { loginUsuario } from '../controllers/loginController.js';
import { enviarCodigoRecuperacion, verificarCodigo, restablecerPassword, reenviarCodigo } from '../controllers/recoveryController.js';
import passport from '../controllers/AutheticationGoogle.js';
import { enviarCodigoRegistro, verificarYRegistrar, reenviarCodigoRegistro } from '../controllers/registerController.js';
import { authLimiter } from '../middlewares/limiters.js';
import { validarRegistro, validarLogin, validarPerfilCompleto } from '../middlewares/validation.js';
const router = express.Router();

// Rutas de autenticación
router.post('/registro', authLimiter, validarRegistro, registrarUser);
router.post('/enviar-codigo-registro', authLimiter, enviarCodigoRegistro);
router.post('/verificar-registro', authLimiter, verificarYRegistrar);
router.post('/reenviar-codigo-registro', authLimiter, reenviarCodigoRegistro);

router.post('/login', authLimiter, validarLogin, loginUsuario);

// Rutas de recuperación de contraseña
router.post('/recuperar-password', authLimiter, enviarCodigoRecuperacion);
router.post('/recuperar-password/verificar', authLimiter, verificarCodigo);
router.post('/recuperar-password/reenviar', authLimiter, reenviarCodigo);
router.post('/recuperar-password/restablecer', authLimiter, restablecerPassword);

// Rutas de Google OAuth
router.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: `${process.env.FRONT_URL}login` }),
    (req, res) => {
        const token = jwt.sign(
            {
                id: req.user._id,
                rol: req.user.rol,
                nombre: req.user.nombre,
                apellido: req.user.apellido,
                email: req.user.email,
                edad: req.user.edad,
                telefono: req.user.telefono,
                googleId: req.user.googleId,
                perfilCompleto: req.user.perfilCompleto
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.redirect(`${process.env.FRONT_URL}auth/google/success?token=${token}`);
    }
);
router.put('/completar-perfil', verificarToken, validarPerfilCompleto, async (req, res) => {
    try {
        const { apellido, edad, telefono } = req.body;

        const usuarioActualizado = await User.findByIdAndUpdate(
            req.usuario._id,
            { apellido, edad, telefono, perfilCompleto: true },
            { new: true }
        );

        res.json({ success: true, usuario: usuarioActualizado });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            mensaje: "Error al actualizar perfil",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;