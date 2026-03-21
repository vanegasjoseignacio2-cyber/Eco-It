import express from 'express';
import { enviarMensajeContacto } from '../controllers/Contactcontroller.js';

const router = express.Router();

// POST /api/contact  → pública (registrados + invitados)
router.post('/', enviarMensajeContacto);

export default router;