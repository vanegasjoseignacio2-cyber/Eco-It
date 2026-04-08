import express from 'express';
import { verificarToken, soloAdmin } from '../middlewares/authMiddleware.js';
import {
    getActiveSlides,
    getAllSlides,
    createSlide,
    updateSlide,
    deleteSlide,
    reorderSlides
} from '../controllers/carouselController.js';

const router = express.Router();

// Ruta pública para el frontend
router.get('/', getActiveSlides);

// Rutas de administración
router.get('/admin', verificarToken, soloAdmin, getAllSlides);
router.post('/', verificarToken, soloAdmin, createSlide);
router.put('/:id', verificarToken, soloAdmin, updateSlide);
router.delete('/:id', verificarToken, soloAdmin, deleteSlide);
router.patch('/reorder', verificarToken, soloAdmin, reorderSlides);

export default router;
