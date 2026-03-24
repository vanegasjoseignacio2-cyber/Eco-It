import express from 'express';
import { verificarToken, soloAdmin } from '../middlewares/authMiddleware.js';
import { 
    obtenerUsuarios, 
    obtenerStats, 
    obtenerDatosAdmin, 
    eliminarUsuarioAdmin,
    banearUsuarioAdmin,
    desbanearUsuarioAdmin
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/usuarios', verificarToken, soloAdmin, obtenerUsuarios);
router.get('/stats', verificarToken, soloAdmin, obtenerStats);
router.get('/admin', verificarToken, soloAdmin, obtenerDatosAdmin);
router.delete('/users/:id', verificarToken, soloAdmin, eliminarUsuarioAdmin);
router.patch('/users/:id/ban', verificarToken, soloAdmin, banearUsuarioAdmin);
router.patch('/users/:id/unban', verificarToken, soloAdmin, desbanearUsuarioAdmin);

export default router;