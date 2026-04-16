import { body, validationResult } from 'express-validator';

/**
 * Middleware para manejar los errores de validación de express-validator
 */
export const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            errores: errores.array().map(err => ({ campo: err.path, mensaje: err.msg }))
        });
    }
    next();
};

/**
 * Reglas de validación para el registro de usuarios
 */
export const validarRegistro = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    body('email')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('Formato de correo electrónico inválido')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    validarCampos
];

/**
 * Reglas de validación para el inicio de sesión
 */
export const validarLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('Formato de correo electrónico inválido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    validarCampos
];

/**
 * Reglas de validación para completar el perfil
 */
export const validarPerfilCompleto = [
    body('apellido')
        .trim()
        .notEmpty().withMessage('El apellido es obligatorio'),
    body('edad')
        .isInt({ min: 1, max: 120 }).withMessage('Edad inválida'),
    body('telefono')
        .trim()
        .notEmpty().withMessage('El teléfono es obligatorio')
        .isMobilePhone().withMessage('Formato de teléfono inválido'),
    validarCampos
];

/**
 * Reglas de validación para cambio de contraseña
 */
export const validarCambioPassword = [
    body('passwordActual')
        .notEmpty().withMessage('La contraseña actual es obligatoria'),
    body('nuevaPassword')
        .notEmpty().withMessage('La nueva contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
    validarCampos
];
