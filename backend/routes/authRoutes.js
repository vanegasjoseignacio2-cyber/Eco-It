import express from 'express';
import { registrarUser } from '../controllers/registerController.js';
import { loginUsuario } from '../controllers/loginController.js';
import { enviarCodigoRecuperacion, verificarCodigo, restablecerPassword, reenviarCodigo } from '../controllers/recoveryController.js';

const router = express.Router();

// Rutas de autenticación
router.post('/registro', registrarUser);
router.post('/login', loginUsuario);

// Rutas de recuperación de contraseña
router.post('/recuperar-password', enviarCodigoRecuperacion);
router.post('/recuperar-password/verificar', verificarCodigo);
router.post('/recuperar-password/reenviar', reenviarCodigo);
router.post('/recuperar-password/restablecer', restablecerPassword);

export default router;