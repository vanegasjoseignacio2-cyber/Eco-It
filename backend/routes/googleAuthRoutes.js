import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Paso 1: El usuario hace clic en "Login con Google" → redirige a Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Paso 2: Google redirige aquí con el código de autorización
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    // Generar JWT para el usuario autenticado
    const token = jwt.sign(
      { id: req.user._id, rol: req.user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirigir al frontend con el token
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

export default router;
