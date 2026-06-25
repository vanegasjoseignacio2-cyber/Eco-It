import { Resend } from 'resend';

// Cliente Resend (singleton, lazy para leer la API key DESPUÉS de dotenv)
let resendClient = null;
const getResend = () => {
    if (!resendClient) {
        resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return resendClient;
};

// Estilos base para los correos
const emailStyles = `
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    border: 1px solid #e5e7eb;
`;

const headerStyles = `
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    padding: 30px 20px;
    text-align: center;
`;

const contentStyles = `
    padding: 40px 30px;
    color: #374151;
    line-height: 1.6;
`;

const footerStyles = `
    background-color: #f9fafb;
    padding: 20px;
    text-align: center;
    font-size: 12px;
    color: #9ca3af;
    border-top: 1px solid #e5e7eb;
`;

const buttonStyles = `
    display: inline-block;
    background-color: #10B981;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    margin-top: 20px;
`;

// Función genérica para enviar correos con Resend.
// Lee EMAIL_FROM/RESEND_API_KEY en tiempo de ejecución (después de dotenv).
// Lanza un error si Resend reporta fallo, para que los controladores lo capturen.
export const sendEmail = async ({ to, subject, html, replyTo }) => {
    const from = process.env.EMAIL_FROM || 'Eco-It <onboarding@resend.dev>';
    // Las direcciones @ecoit.site son solo de envío; si alguien responde, el correo
    // se redirige a un buzón real: replyTo explícito (p.ej. quien escribe en contacto),
    // o en su defecto EMAIL_REPLY_TO / ADMIN_EMAIL.
    const finalReplyTo = replyTo || process.env.EMAIL_REPLY_TO || process.env.ADMIN_EMAIL;
    const resend = getResend();

    const payload = { from, to, subject, html };
    if (finalReplyTo) payload.replyTo = finalReplyTo;

    const { data, error } = await resend.emails.send(payload);

    if (error) {
        console.error(`Error enviando correo a ${to}:`, error);
        throw new Error(error.message || JSON.stringify(error));
    }

    console.log(`Correo enviado a ${to}: ${subject} (id: ${data?.id})`);
    return { success: true, id: data?.id };
};

// ==========================================
// PLANTILLAS DE CORREO
// ==========================================

export const sendWelcomeEmail = async (email, nombre) => {
    const FRONT = (process.env.FRONT_URL || 'http://localhost:5173').replace(/\/$/, '');
    const html = `
        <div style="${emailStyles}">
            <div style="${headerStyles}">
                <h1 style="color: white; margin: 0; font-size: 24px;">¡Bienvenido a Eco-It! 🌿</h1>
            </div>
            <div style="${contentStyles}">
                <h2 style="color: #059669; margin-top: 0;">Hola ${nombre},</h2>
                <p>Estamos muy felices de que te unas a nuestra comunidad de reciclaje inteligente. Tu cuenta ha sido creada exitosamente.</p>
                <p>Con Eco-It podrás:</p>
                <ul style="color: #4b5563;">
                    <li>Gestionar tu perfil de reciclaje.</li>
                    <li>Consultar tips con nuestra IA.</li>
                    <li>Localizar puntos de reciclaje cercanos.</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${FRONT}/login" style="${buttonStyles}">Iniciar Sesión</a>
                </div>
                <p>¡Esperamos que disfrutes de la experiencia!</p>
            </div>
            <div style="${footerStyles}">
                <p>© 2024 Eco-It. Juntos por un planeta más limpio.</p>
            </div>
        </div>
    `;

    return sendEmail({ to: email, subject: '¡Bienvenido a Eco-It!', html });
};

export const sendRecoveryEmail = async (email, code) => {
    const html = `
        <div style="${emailStyles}">
            <div style="${headerStyles}">
                <h1 style="color: white; margin: 0; font-size: 24px;">Recuperación de Contraseña</h1>
            </div>
            <div style="${contentStyles}">
                <p>Has solicitado restablecer tu contraseña en Eco-It.</p>
                <p>Usa el siguiente código de verificación para continuar:</p>
                <div style="background-color: #F0FDF4; padding: 20px; border-radius: 12px; text-align: center; margin: 25px 0; border: 2px dashed #10B981;">
                    <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #059669; font-family: monospace;">${code}</span>
                </div>
                <p style="font-size: 14px; color: #6b7280;">Este código expira en 15 minutos.</p>
                <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
            </div>
            <div style="${footerStyles}">
                <p>Este es un mensaje automático, por favor no respondas.</p>
            </div>
        </div>
    `;

    return sendEmail({ to: email, subject: 'Código de recuperación - Eco-It', html });
};
