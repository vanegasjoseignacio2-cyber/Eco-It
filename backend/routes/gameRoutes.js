import express from 'express';
import {
    guardarPuntaje,
    obtenerRanking,
    obtenerTemporada,
    obtenerLogros
} from '../controllers/gameController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas del juego requieren autenticación
router.post('/puntaje', verificarToken, guardarPuntaje);
router.get('/ranking', verificarToken, obtenerRanking);
router.get('/temporada', verificarToken, obtenerTemporada);
router.get('/logros', verificarToken, obtenerLogros);

export default router;
