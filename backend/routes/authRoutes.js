import User from '../models/user.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { registrarUser } from '../controllers/registerController.js';
import { loginUsuario, logoutUsuario } from '../controllers/loginController.js';
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
router.post('/logout', logoutUsuario);

// Rutas de recuperación de contraseña
router.post('/recuperar-password', authLimiter, enviarCodigoRecuperacion);
router.post('/recuperar-password/verificar', authLimiter, verificarCodigo);
router.post('/recuperar-password/reenviar', authLimiter, reenviarCodigo);
router.post('/recuperar-password/restablecer', authLimiter, restablecerPassword);

// Rutas de Google OAuth
router.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    (req, res, next) => {
        const FRONT = (process.env.FRONT_URL || 'http://localhost:5173').trim().replace(/\/$/, '');
        passport.authenticate("google", { failureRedirect: `${FRONT}/login` })(req, res, next);
    },
    (req, res) => {
        // Obtenemos FRONT_URL dentro del handler para asegurar que dotenv ya cargó
        const FRONT = (process.env.FRONT_URL || 'http://localhost:5173').trim().replace(/\/$/, '');
        
        const token = jwt.sign(
            {
                id: req.user._id,
                rol: req.user.rol,
                perfilCompleto: req.user.perfilCompleto
            },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        // En lugar de usar cookies, pasamos el token en la URL de redirección
        // Esto permite al frontend extraerlo y guardarlo en localStorage
        res.status(200).send(`
            <html>
                <head><title>Autenticando...</title></head>
                <body>
                    <script>
                        window.location.href = "${FRONT}/auth/google/success?token=${token}";
                    </script>
                </body>
            </html>
        `);
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