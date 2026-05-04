import crypto from 'crypto';
import User from "../models/user.js";
import PendingRegistration from "../models/PendingRegistration.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { sendWelcomeEmail } from '../utils/emailService.js';
import { buildVerificationEmailHTML } from '../utils/verificationEmailTemplate.js';
import AuditLog from "../models/AuditLog.js";
import { createAuditLog } from "../utils/auditLogger.js";

// ─── Transporter lazy ────────────────────────────────────────────────────────
const getTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ─── Helper: fecha legible Colombia ──────────────────────────────────────────
const fechaColombia = () =>
    new Date().toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
        dateStyle: 'full',
        timeStyle: 'short',
    });

// ─────────────────────────────────────────────────────────────────────────────
// PASO 1: Enviar código de verificación al email
// POST /api/auth/enviar-codigo-registro
// ─────────────────────────────────────────────────────────────────────────────
export const enviarCodigoRegistro = async (req, res) => {
    try {
        const { nombre, apellido, edad, email, telefono, password } = req.body;

        // Validar campos obligatorios
        if (!nombre || !apellido || !edad || !email || !telefono || !password) {
            return res.status(400).json({ success: false, mensaje: 'Todos los campos son obligatorios.' });
        }

        // Verificar si ya existe un usuario registrado con ese email
        const usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ success: false, mensaje: 'Este correo ya tiene una cuenta registrada.' });
        }

        // Verificar cooldown: si ya hay un pendiente reciente (últimos 3 min)
        const pendienteExistente = await PendingRegistration.findOne({ email });
        if (pendienteExistente) {
            const tiempoRestante = pendienteExistente.expira.getTime() - Date.now();
            const tresMinutosEnMs = 12 * 60 * 1000; // 15 - 3 = 12 min restantes = menos de 3 min pasados
            if (tiempoRestante > tresMinutosEnMs) {
                const minutosEspera = Math.ceil((tiempoRestante - tresMinutosEnMs) / 60000);
                return res.status(429).json({
                    success: false,
                    mensaje: `Espera ${minutosEspera} minuto(s) antes de solicitar otro código.`,
                });
            }
        }

        // Hashear contraseña antes de guardar temporalmente
        const passwordHasheada = await bcrypt.hash(password, 12);

        // Generar código de 6 dígitos y hashearlo antes de guardarlo en BD
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        const codigoHash = crypto.createHash('sha256').update(codigo).digest('hex');
        const expira = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        // Guardar o actualizar el registro pendiente (se guarda el HASH, no el código plano)
        await PendingRegistration.findOneAndUpdate(
            { email },
            { nombre, apellido, edad: Number(edad), email, telefono, password: passwordHasheada, codigo: codigoHash, expira, intentos: 0 },
            { upsert: true, new: true }
        );

        // Enviar correo de verificación
        const html = buildVerificationEmailHTML({ nombre, codigo, fecha: fechaColombia() });

        await getTransporter().sendMail({
            from:    `"Eco-It" <${process.env.EMAIL_USER}>`,
            to:      email,
            subject: `[Eco-It] Tu código de verificación: ${codigo}`,
            html,
        });

        console.log(`📧 Código de registro enviado a ${email}`);

        return res.status(200).json({
            success: true,
            mensaje: 'Código enviado a tu correo electrónico.',
        });

    } catch (error) {
        console.error('❌ Error en enviarCodigoRegistro:', error);
        return res.status(500).json({ success: false, mensaje: 'Error al enviar el código.', error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PASO 2: Verificar código y crear el usuario en BD
// POST /api/auth/verificar-registro
// ─────────────────────────────────────────────────────────────────────────────
export const verificarYRegistrar = async (req, res) => {
    try {
        const { email, codigo } = req.body;

        if (!email || !codigo) {
            return res.status(400).json({ success: false, mensaje: 'Email y código son obligatorios.' });
        }

        // Buscar registro pendiente
        const pendiente = await PendingRegistration.findOne({ email });

        if (!pendiente) {
            return res.status(400).json({
                success: false,
                mensaje: 'No hay un registro pendiente para este email. Vuelve a registrarte.',
            });
        }

        // Verificar expiración
        if (pendiente.expira < new Date()) {
            await PendingRegistration.deleteOne({ email });
            return res.status(400).json({
                success: false,
                mensaje: 'El código expiró. Vuelve a registrarte para recibir uno nuevo.',
            });
        }

        // Verificar intentos (máx 5)
        if (pendiente.intentos >= 5) {
            await PendingRegistration.deleteOne({ email });
            return res.status(400).json({
                success: false,
                mensaje: 'Demasiados intentos incorrectos. Vuelve a registrarte.',
            });
        }

        // Hashear el código recibido y comparar contra el hash guardado
        const codigoHashRecibido = crypto.createHash('sha256').update(codigo.trim()).digest('hex');
        if (pendiente.codigo !== codigoHashRecibido) {
            pendiente.intentos += 1;
            await pendiente.save();
            const restantes = 5 - pendiente.intentos;
            return res.status(400).json({
                success: false,
                mensaje: `Código incorrecto. Te quedan ${restantes} intento(s).`,
            });
        }

        // ── Código correcto → crear usuario en BD ────────────────────────────
        const nuevoUser = new User({
            nombre:          pendiente.nombre,
            apellido:        pendiente.apellido,
            edad:            pendiente.edad,
            email:           pendiente.email,
            telefono:        pendiente.telefono,
            password:        pendiente.password, // ya hasheada
            rol:             'user',
            perfilCompleto:  true,
            emailVerificado: true,
        });

        // Guardar sin disparar el pre-save de hashing (ya está hasheada)
        // Se logra sobreescribiendo el hook temporalmente: usamos save() normal
        // ya que el modelo debería detectar que la contraseña ya está hasheada.
        // Si tu modelo hashea SIEMPRE en pre-save, usa este patrón:
        nuevoUser.$skipPasswordHash = true; // ← tu modelo debe chequear esta flag (ver nota abajo)
        await nuevoUser.save();

        // Eliminar el registro pendiente
        await PendingRegistration.deleteOne({ email });

        // Crear registro de auditoría
        await createAuditLog(req.app, {
            type: 'register',
            action: 'Nuevo Usuario',
            details: `Usuario registrado: ${nuevoUser.email}`,
            user: `${nuevoUser.nombre} ${nuevoUser.apellido}`.trim() || nuevoUser.email
        });

        // Enviar correo de bienvenida (no bloquea)
        sendWelcomeEmail(nuevoUser.email, nuevoUser.nombre)
            .catch(err => console.error('Error al enviar bienvenida:', err));

        // Generar JWT
        const token = jwt.sign(
            {
                id:             nuevoUser._id,
                rol:            nuevoUser.rol,
                perfilCompleto: nuevoUser.perfilCompleto,
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Configurar cookie HttpOnly
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días (coincide con expiresIn de jwt)
        });

        console.log(`✅ Usuario registrado y verificado: ${email}`);

        return res.status(201).json({
            success: true,
            mensaje: '¡Cuenta verificada y creada exitosamente!',
            data: {
                usuario: {
                    id:              nuevoUser._id,
                    nombre:          nuevoUser.nombre,
                    apellido:        nuevoUser.apellido,
                    email:           nuevoUser.email,
                    telefono:        nuevoUser.telefono,
                    edad:            nuevoUser.edad,
                    rol:             nuevoUser.rol,
                    perfilCompleto:  nuevoUser.perfilCompleto,
                },
            },
        });

    } catch (error) {
        console.error('❌ Error en verificarYRegistrar:', error);
        return res.status(500).json({ success: false, mensaje: 'Error al crear la cuenta.', error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// REENVIAR código de registro (mismo cooldown que recuperación)
// POST /api/auth/reenviar-codigo-registro
// ─────────────────────────────────────────────────────────────────────────────
export const reenviarCodigoRegistro = async (req, res) => {
    try {
        const { email } = req.body;

        const pendiente = await PendingRegistration.findOne({ email });
        if (!pendiente) {
            return res.status(404).json({
                success: false,
                mensaje: 'No hay un registro pendiente. Vuelve a registrarte.',
            });
        }

        // Cooldown de 3 minutos
        const tiempoRestante = pendiente.expira.getTime() - Date.now();
        const tresMinutosEnMs = 12 * 60 * 1000;
        if (tiempoRestante > tresMinutosEnMs) {
            const minutosEspera = Math.ceil((tiempoRestante - tresMinutosEnMs) / 60000);
            return res.status(429).json({
                success: false,
                mensaje: `Espera ${minutosEspera} minuto(s) antes de reenviar.`,
            });
        }

        // Generar nuevo código y hashearlo antes de guardar
        const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
        const nuevoCodigoHash = crypto.createHash('sha256').update(nuevoCodigo).digest('hex');
        pendiente.codigo   = nuevoCodigoHash;
        pendiente.expira   = new Date(Date.now() + 15 * 60 * 1000);
        pendiente.intentos = 0;
        await pendiente.save();

        const html = buildVerificationEmailHTML({ nombre: pendiente.nombre, codigo: nuevoCodigo, fecha: fechaColombia() });

        await getTransporter().sendMail({
            from:    `"Eco-It" <${process.env.EMAIL_USER}>`,
            to:      email,
            subject: `[Eco-It] Tu nuevo código de verificación: ${nuevoCodigo}`,
            html,
        });

        return res.status(200).json({ success: true, mensaje: 'Nuevo código enviado a tu correo.' });

    } catch (error) {
        console.error('❌ Error en reenviarCodigoRegistro:', error);
        return res.status(500).json({ success: false, mensaje: 'Error al reenviar el código.', error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRO ORIGINAL (mantenido por compatibilidad con Google OAuth si lo usa)
// ─────────────────────────────────────────────────────────────────────────────
export const registrarUser = async (req, res) => {
    return res.status(400).json({
        success: false,
        mensaje: 'Usa el flujo de verificación por email: /enviar-codigo-registro → /verificar-registro',
    });
};