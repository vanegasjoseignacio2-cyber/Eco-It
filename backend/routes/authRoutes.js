import express from 'express';
import { registrarUser } from '../controllers/registerController.js';
import { loginUsuario } from '../controllers/loginController.js';

const router = express.Router();

// Rutas de autenticación
router.post('/registro', registrarUser);
router.post('/login', loginUsuario);

export default router;