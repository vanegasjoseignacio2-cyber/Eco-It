import express from 'express';
import { verificarToken, soloAdmin, soloSuperadmin } from '../middlewares/authMiddleware.js';
import {
    obtenerUsuarios,
    obtenerStats,
    obtenerDatosAdmin,
    eliminarUsuarioAdmin,
    banearUsuarioAdmin,
    desbanearUsuarioAdmin,
    cambiarRolUsuario,
    obtenerNotificaciones,
    marcarNotificacionesLeidas,
    eliminarNotificacion,
    eliminarTodasNotificaciones,
    obtenerAuditLogs,
    eliminarAuditLog,
    eliminarTodosAuditLogs
} from '../controllers/adminController.js';
import {
    crearPunto,
    obtenerPuntos,
    actualizarPunto,
    eliminarPunto,
    toggleActivoPunto
} from '../controllers/puntosController.js';

const router = express.Router();

router.get('/usuarios', verificarToken, soloAdmin, obtenerUsuarios);
router.get('/stats', verificarToken, soloAdmin, obtenerStats);
router.get('/admin', verificarToken, soloAdmin, obtenerDatosAdmin);
router.get('/notifications', verificarToken, soloAdmin, obtenerNotificaciones);
router.get('/audit', verificarToken, soloAdmin, obtenerAuditLogs);
router.delete('/audit/all', verificarToken, soloSuperadmin, eliminarTodosAuditLogs);
router.delete('/audit/:id', verificarToken, soloSuperadmin, eliminarAuditLog);
router.patch('/notifications/mark-read', verificarToken, soloAdmin, marcarNotificacionesLeidas);
router.delete('/notifications/all', verificarToken, soloSuperadmin, eliminarTodasNotificaciones);
router.delete('/notifications/:id', verificarToken, soloSuperadmin, eliminarNotificacion);
router.delete('/users/:id', verificarToken, soloAdmin, eliminarUsuarioAdmin);
router.patch('/users/:id/ban', verificarToken, soloAdmin, banearUsuarioAdmin);
router.patch('/users/:id/unban', verificarToken, soloAdmin, desbanearUsuarioAdmin);
router.patch('/users/:id/role', verificarToken, soloSuperadmin, cambiarRolUsuario);

// ── Gestión de Puntos de Reciclaje (Mapa) ──────────────────────────────────
router.get('/map/points', verificarToken, soloAdmin, obtenerPuntos);
router.post('/map/points', verificarToken, soloAdmin, crearPunto);
router.patch('/map/points/:id', verificarToken, soloAdmin, actualizarPunto);
router.delete('/map/points/:id', verificarToken, soloAdmin, eliminarPunto);
router.patch('/map/points/:id/toggle', verificarToken, soloAdmin, toggleActivoPunto);

export default router;