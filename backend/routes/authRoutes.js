import express from 'express';
import { registrarUsuario } from '../controllers/registerController.js';
import { iniciarSesion } from '../controllers/loginController.js';

const router = express.Router();

// Rutas de autenticación
router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);

export default router;