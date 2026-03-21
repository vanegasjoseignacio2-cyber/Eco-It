import crypto from 'crypto';
import User from '../models/user.js';
import { sendRecoveryEmail } from '../utils/emailService.js';
// Reenviar código
export const reenviarCodigo = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`Solicitud de reenvío de código para: ${email}`);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                mensaje: 'No existe un usuario con ese email'
            });
        }

        // Verificar si existe un código previo y si han pasado al menos 3 minutos
        const tiempoRestante = user.resetPasswordExpires ? user.resetPasswordExpires.getTime() - Date.now() : 0;
        const tresMinutosEnMs = 12 * 60 * 1000; // 12 minutos en ms (15 - 3)

        // Si el tiempo restante es MAYOR que 12 minutos, significa que han pasado MENOS de 3 minutos
        if (tiempoRestante > tresMinutosEnMs) {
            const tiempoEsperaMs = tiempoRestante - tresMinutosEnMs;
            const minutosEspera = Math.ceil(tiempoEsperaMs / 60000);
            return res.status(429).json({
                success: false,
                mensaje: `Por favor espera ${minutosEspera} minuto(s) antes de solicitar otro código.`
            });
        }

        // --- Invalidar el código anterior y generar uno nuevo ---
        
        // Generar nuevo código y hashearlo antes de guardar en BD
        const nuevoResetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const nuevoResetTokenHash = crypto.createHash('sha256').update(nuevoResetToken).digest('hex');

        // Al sobreescribir resetPasswordToken, el código anterior queda automáticamente invalidado
        user.resetPasswordToken = nuevoResetTokenHash;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Nuevo tiempo de expiración: 15 minutos desde AHORA

        await user.save();

        // Enviar el nuevo código por correo
        const emailResult = await sendRecoveryEmail(email, nuevoResetToken);

        if (emailResult.success) {
            res.status(200).json({
                success: true,
                mensaje: 'Nuevo código enviado a tu correo electrónico'
            });
        } else {
            res.status(200).json({
                success: true,
                mensaje: 'Nuevo código generado (Error al enviar correo - Revisa logs)'
            });
        }

    } catch (error) {
        console.error('Error en reenviarCodigo:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al procesar la solicitud de reenvío',
            error: error.message
        });
    }
};

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

        // Generar código y hashearlo antes de guardar en BD
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = resetTokenHash;
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
                mensaje: 'Código generado (Error al enviar correo - Revisa logs)'
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
        console.log(`Verificando código para ${email}: '${codigo}'`);

        const codigoHash = crypto.createHash('sha256').update(codigo.trim()).digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken: codigoHash,
            resetPasswordExpires: { $gt: new Date() } // Verifica que no haya expirado usando un objeto Date
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

        const codigoHash = crypto.createHash('sha256').update(codigo.trim()).digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken: codigoHash,
            resetPasswordExpires: { $gt: new Date() } // Verifica que no haya expirado usando un objeto Date
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