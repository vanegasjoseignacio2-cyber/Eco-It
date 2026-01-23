import express from 'express';
import { 
  consultarIA, 
  analizarImagen,
  obtenerSugerencias 
} from '../controllers/aiController.js';
import { proteger } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas protegidas (requieren autenticación)
router.post('/consultar', proteger, consultarIA);
router.post('/analizar-imagen', proteger, analizarImagen);
router.get('/sugerencias', proteger, obtenerSugerencias);

export default router;