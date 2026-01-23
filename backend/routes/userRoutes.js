import express from 'express';
import { 
  obtenerPerfil, 
  actualizarPerfil, 
  cambiarPassword 
} from '../controllers/userController.js';
import { proteger } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas estas rutas están protegidas (requieren token)
router.get('/perfil', proteger, obtenerPerfil);
router.put('/perfil', proteger, actualizarPerfil);
router.put('/cambiar-password', proteger, cambiarPassword);

export default router;