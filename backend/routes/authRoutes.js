import express from 'express';
import { registrarUser } from '../controllers/registerController.js';
import { loginUsuario } from '../controllers/loginController.js';
import { enviarCodigoRecuperacion, verificarCodigo, restablecerPassword, reenviarCodigo } from '../controllers/recoveryController.js';
import passport from '../controllers/AutheticationGoogle.js' 

const router = express.Router();

// Rutas de autenticación
router.post('/registro', registrarUser);
router.post('/login', loginUsuario);

// Rutas de recuperación de contraseña
router.post('/recuperar-password', enviarCodigoRecuperacion);
router.post('/recuperar-password/verificar', verificarCodigo);
router.post('/recuperar-password/reenviar', reenviarCodigo);
router.post('/recuperar-password/restablecer', restablecerPassword);

//rutas de iniciar con google 
router.get('/google',passport.authenticate("google",{scope:["profile","email"]}));
// Callback de Google
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // aquí puedes crear JWT o sesión
        res.redirect("http://localhost:5173/dashboard");
    }
);

export default router;