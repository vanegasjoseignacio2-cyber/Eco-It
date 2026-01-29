import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { sendRecoveryEmail } from '../utils/emailService.js';

// Enviar código de recuperación
export const enviarCodigoRecuperacion = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`Solicitud de recuperación para: ${email}`);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                mensaje: 'No existe un usuario con ese email'
            });
        }

        // Generar código numérico aleatorio de 6 dígitos
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutos

        await user.save();

        // Usar el servicio de email centralizado
        const emailResult = await sendRecoveryEmail(email, resetToken);

        if (emailResult.success) {
            res.status(200).json({
                success: true,
                mensaje: 'Código enviado a tu correo electrónico'
            });
        } else {
            // Fallback para desarrollo (si falla el envío real)
            res.status(200).json({
                success: true,
                mensaje: 'Código generado (Error al enviar correo - Revisa logs)',
                debugCodigo: resetToken
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al procesar la solicitud',
            error: error.message
        });
    }
};

// Verificar código (opcional, si queremos un paso intermedio antes de cambiar el pass)
export const verificarCodigo = async (req, res) => {
    try {
        const { email, codigo } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordToken: codigo,
            resetPasswordExpires: { $gt: Date.now() } // Verifica que no haya expirado
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                mensaje: 'Código inválido o expirado'
            });
        }

        res.status(200).json({
            success: true,
            mensaje: 'Código válido'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al verificar código'
        });
    }
};

// Restablecer contraseña final
export const restablecerPassword = async (req, res) => {
    try {
        const { email, codigo, password } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordToken: codigo,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                mensaje: 'Código inválido o expirado'
            });
        }

        // Asignar nueva contraseña (en texto plano)
        // El hook pre('save') del modelo se encargará de encriptarla
        user.password = password;

        // Limpiar tokens de recuperación
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            mensaje: 'Contraseña actualizada correctamente'
        });

    } catch (error) {
        console.error('Error al restablecer password:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar contraseña'
        });
    }
};
