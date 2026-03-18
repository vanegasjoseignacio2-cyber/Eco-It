import User from "../models/user.js";
import express from 'express';
import { verificarToken,soloAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/usuarios', verificarToken, soloAdmin, async (req, res) => {
    try {
        const usuarios = await User.find()
            .select('-password -resetPasswordToken -resetPasswordExpires')
            .sort({ createdAt: -1 });

        res.json({ success: true, usuarios });
    } catch (error) {
        res.json({ success: false, mensaje: error.message });
    }
});

router.get('/stats', verificarToken, soloAdmin, async (req, res) => {
    try {
        const totalUsuarios = await User.countDocuments();
        res.json({ success: true, totalUsuarios });
    } catch (error) {
        res.json({ success: false, mensaje: error.message });
    }
});

router.get('/admin', verificarToken, soloAdmin, (req, res) => {
    res.json({ message: 'Bienvenido al panel de administrador',
    admin: {
        nombre: req.usuario.nombre,
        email: req.usuario.email,
        rol: req.usuario.rol
       }
    });
});

export default router;