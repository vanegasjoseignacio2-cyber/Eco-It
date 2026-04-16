import express from 'express';
import {
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword,
  eliminarUsuario
} from '../controllers/userController.js';
import {
  obtenerPuntosPublic
} from '../controllers/puntosController.js';
import { enviarCodigoRecuperacion, verificarCodigo, restablecerPassword, reenviarCodigo } from '../controllers/recoveryController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { validarCambioPassword } from '../middlewares/validation.js';

const router = express.Router();

// Rutas públicas
router.post('/restablecer-password', restablecerPassword);
router.post('/recuperar-password', enviarCodigoRecuperacion);
router.post('/verificar-codigo', verificarCodigo);
router.post('/reenviar-codigo', reenviarCodigo);

// Todas estas rutas están protegidas (requieren token)
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/perfil', verificarToken, actualizarPerfil);
router.put('/cambiar-password', verificarToken, validarCambioPassword, cambiarPassword);
router.delete('/perfil', verificarToken, eliminarUsuario);
router.get('/map-points', obtenerPuntosPublic); // Ruta pública para obtener puntos del mapa

export default router;