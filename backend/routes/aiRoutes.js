import express from 'express';
import { 
  consultarIA, 
  analizarImagen,
  obtenerSugerencias 
} from '../controllers/aiController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas protegidas (requieren autenticación)
router.post('/consultar', verificarToken, consultarIA);
router.post('/analizar-imagen', verificarToken, analizarImagen);
router.get('/sugerencias', verificarToken, obtenerSugerencias);

export default router;