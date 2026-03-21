import nodemailer from 'nodemailer';

// ─── Transporter lazy ────────────────────────────────────────────────────────
const getTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


// Celda ícono con emoji (100% compatible con Gmail)
const iconCell = (emoji) =>
    `<td style="width:34px;padding-right:12px;vertical-align:middle;">
       <div style="width:34px;height:34px;background:#f0fdf4;border:1.5px solid #bbf7d0;
                   border-radius:9px;text-align:center;line-height:34px;font-size:16px;">
         ${emoji}
       </div>
     </td>`;

// ─── Template HTML ────────────────────────────────────────────────────────────
const buildContactEmailHTML = ({ name, email, subject, message, isRegistered, fecha }) => {
    const subjectLabels = {
        general:     'Consulta general',
        support:     'Soporte técnico',
        suggestion:  'Sugerencia',
        partnership: 'Colaboración',
    };
    const subjectLabel = subjectLabels[subject] || subject;

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Nuevo mensaje de Eco-It</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;
             font-family:'Segoe UI',system-ui,-apple-system,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0"
       style="background:#f0fdf4;padding:48px 20px 56px;">
  <tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0"
         style="max-width:560px;width:100%;">

    <!-- ══ HEADER ══════════════════════════════════════════════════════════ -->
    <tr>
      <td style="background:linear-gradient(145deg,#15803d 0%,#059669 55%,#047857 100%);
                 border-radius:20px 20px 0 0;padding:44px 44px 36px;text-align:center;">

        <div style="display:inline-block;width:88px;height:88px;
                    background:rgba(255, 255, 255, 0.31);
                    border:2px solid rgba(255, 255, 255, 0.4);
                    border-radius:50%;text-align:center;
                    line-height:88px;margin-bottom:22px;font-size:46px;">
          🌿
        </div>

        <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;
                   letter-spacing:-0.8px;line-height:1;">Eco-It</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.72);font-size:12px;
                  font-weight:600;letter-spacing:2px;text-transform:uppercase;">
          Nuevo mensaje de contacto
        </p>

      </td>
    </tr>

    <!-- ══ BADGES ══════════════════════════════════════════════════════════ -->
    <tr>
      <td style="background:#ffffff;padding:22px 44px 0;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:8px;">
              <span style="display:inline-block;background:#f0fdf4;color:#15803d;
                           font-size:12px;font-weight:700;padding:6px 14px;
                           border-radius:999px;border:1.5px solid #86efac;">
                🏷️&nbsp;${subjectLabel}
              </span>
            </td>
            <td>
              ${isRegistered
                ? `<span style="display:inline-block;background:#eff6ff;color:#1d4ed8;
                               font-size:12px;font-weight:700;padding:6px 14px;
                               border-radius:999px;border:1.5px solid #93c5fd;">
                     &nbsp;Usuario registrado
                   </span>`
                : `<span style="display:inline-block;background:#fefce8;color:#854d0e;
                               font-size:12px;font-weight:700;padding:6px 14px;
                               border-radius:999px;border:1.5px solid #fde047;">
                     👤&nbsp;Invitado
                   </span>`
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ══ DIVIDER ══════════════════════════════════════════════════════════ -->
    <tr>
      <td style="background:#ffffff;padding:20px 44px 0;">
        <div style="height:1px;background:#e5e7eb;"></div>
      </td>
    </tr>

    <!-- ══ NOMBRE ══════════════════════════════════════════════════════════ -->
    <tr>
      <td style="background:#ffffff;padding:22px 44px 0;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            ${iconCell('👤')}
            <td style="vertical-align:middle;">
              <p style="margin:0;font-size:11px;color:#9ca3af;font-weight:600;
                         text-transform:uppercase;letter-spacing:0.7px;">Nombre</p>
              <p style="margin:4px 0 0;font-size:16px;color:#111827;font-weight:700;">
                ${name}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ══ CORREO ══════════════════════════════════════════════════════════ -->
    <tr>
      <td style="background:#ffffff;padding:16px 44px 0;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            ${iconCell('✉️')}
            <td style="vertical-align:middle;">
              <p style="margin:0;font-size:11px;color:#9ca3af;font-weight:600;
                         text-transform:uppercase;letter-spacing:0.7px;">Correo electrónico</p>
              <p style="margin:4px 0 0;font-size:15px;font-weight:600;">
                <a href="mailto:${email}" style="color:#16a34a;text-decoration:none;">
                  ${email}
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ══ DIVIDER ══════════════════════════════════════════════════════════ -->
    <tr>
      <td style="background:#ffffff;padding:20px 44px 0;">
        <div style="height:1px;background:#e5e7eb;"></div>
      </td>
    </tr>

    <!-- ══ MENSAJE ══════════════════════════════════════════════════════════ -->
    <tr>
      <td style="background:#ffffff;padding:22px 44px 0;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            ${iconCell('💬')}
            <td style="vertical-align:middle;">
              <p style="margin:0;font-size:11px;color:#9ca3af;font-weight:600;
                         text-transform:uppercase;letter-spacing:0.7px;">Mensaje</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;padding:12px 44px 0;">
        <div style="background:#f8fffe;border:1.5px solid #d1fae5;
                    border-left:4px solid #22c55e;border-radius:12px;
                    padding:18px 22px;">
          <p style="margin:0;font-size:15px;color:#1f2937;line-height:1.8;
                    white-space:pre-wrap;">${message}</p>
        </div>
      </td>
    </tr>

    <!-- ══ BOTÓN RESPONDER ══════════════════════════════════════════════════ -->
    <tr>
      <td style="background:#ffffff;padding:24px 44px 36px;text-align:center;">
        <a href="mailto:${email}?subject=Re: ${subjectLabel}"
           style="display:inline-block;
                  background:linear-gradient(135deg,#16a34a 0%,#059669 100%);
                  color:#ffffff;font-size:14px;font-weight:700;
                  padding:13px 34px;border-radius:12px;text-decoration:none;
                  letter-spacing:0.3px;">
          ↩&nbsp;&nbsp;Responder a ${name}
        </a>
      </td>
    </tr>

    <!-- ══ FOOTER ══════════════════════════════════════════════════════════ -->
    <tr>
      <td style="background:#f0fdf4;border-top:1.5px solid #d1fae5;
                 border-radius:0 0 20px 20px;padding:22px 44px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#6b7280;">
          📅&nbsp;&nbsp;Recibido el&nbsp;&nbsp;<strong style="color:#374151;">${fecha}</strong>
        </p>
        <p style="margin:10px 0 0;font-size:11px;color:#9ca3af;line-height:1.6;">
          Mensaje enviado desde el formulario de contacto de
          <strong style="color:#15803d;">Eco-It</strong>.
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;
};

// ─── Controlador principal ────────────────────────────────────────────────────
export const enviarMensajeContacto = async (req, res) => {
    try {
        const { name, email, subject, message, userId } = req.body;

        if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios.',
            });
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                mensaje: 'El formato del correo no es válido.',
            });
        }

        const fecha = new Date().toLocaleString('es-CO', {
            timeZone: 'America/Bogota',
            dateStyle: 'full',
            timeStyle: 'short',
        });

        const html = buildContactEmailHTML({
            name,
            email,
            subject,
            message,
            isRegistered: !!userId,
            fecha,
        });

        const subjectLabels = {
            general: 'Consulta general', support: 'Soporte técnico',
            suggestion: 'Sugerencia',   partnership: 'Colaboración',
        };

        await getTransporter().sendMail({
            from:    `"Eco-It Contacto" <${process.env.EMAIL_USER}>`,
            to:      process.env.ADMIN_EMAIL || 'ecoit4167@gmail.com',
            replyTo: email,
            subject: `[Eco-It] ${subjectLabels[subject] || subject} — ${name}`,
            html,
        });

        console.log(`✅ Mensaje de contacto recibido de ${name} <${email}>`);

        return res.status(200).json({
            success: true,
            mensaje: '¡Mensaje enviado! Te responderemos pronto.',
        });

    } catch (error) {
        console.error('❌ Error en enviarMensajeContacto:', error);
        return res.status(500).json({
            success: false,
            mensaje: 'Error al enviar el mensaje. Intenta de nuevo.',
            error: error.message,
        });
    }
};