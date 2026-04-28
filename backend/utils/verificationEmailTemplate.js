    /**
     * Template HTML futurista para el correo de verificación de registro.
     * Tema: oscuro con acento verde neón — estilo tech/cyberpunk de Eco-It.
     * Compatible con Gmail (sin SVG inline, solo emojis e imágenes base64).
     */
    export const buildVerificationEmailHTML = ({ nombre, codigo, fecha }) => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
    <title>Verifica tu cuenta — Eco-It</title>
    </head>
    <body style="margin:0;padding:0;background:#0a0f0a;
                font-family:'Segoe UI',system-ui,-apple-system,Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0"
        style="background:#0a0f0a;padding:48px 20px 56px;">
    <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0"
            style="max-width:560px;width:100%;">

        <!-- ══ HEADER ══════════════════════════════════════════════════════════ -->
        <tr>
        <td style="background:linear-gradient(145deg,#052e16 0%,#14532d 50%,#052e16 100%);
                    border-radius:20px 20px 0 0;padding:44px 44px 40px;text-align:center;
                    border:1px solid #166534;border-bottom:none;">

            <!-- Grid decorativo de fondo simulado con tabla -->
            <div style="position:relative;">

            <!-- Icono principal -->
            <div style="display:inline-block;width:80px;height:80px;
                        background:rgba(34,197,94,0.12);
                        border:2px solid rgba(34,197,94,0.4);
                        border-radius:20px;text-align:center;
                        line-height:80px;margin-bottom:22px;font-size:38px;
                        box-shadow:0 0 24px rgba(34,197,94,0.2);">
                🛡️
            </div>

            <h1 style="margin:0;font-size:30px;font-weight:800;letter-spacing:-1px;
                        line-height:1.1;">
                <span style="color:#4ade80;">Eco</span><span style="color:#ffffff;">-It</span>
            </h1>

            <p style="margin:10px 0 0;color:rgba(255,255,255,0.45);font-size:11px;
                        font-weight:700;letter-spacing:3px;text-transform:uppercase;">
                Verificación de cuenta
            </p>

            </div>
        </td>
        </tr>

        <!-- ══ FRANJA VERDE NEÓN ════════════════════════════════════════════════ -->
        <tr>
        <td style="background:linear-gradient(90deg,#16a34a,#22c55e,#16a34a);
                    height:3px;font-size:0;line-height:0;">&#8203;</td>
        </tr>

        <!-- ══ CUERPO ═══════════════════════════════════════════════════════════ -->
        <tr>
        <td style="background:#0f1a0f;padding:36px 44px 0;
                    border-left:1px solid #166534;border-right:1px solid #166534;">

            <p style="margin:0 0 6px;font-size:13px;color:#4ade80;font-weight:700;
                    text-transform:uppercase;letter-spacing:1.5px;">
            Hola, ${nombre} 👋
            </p>
            <h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#ffffff;
                    letter-spacing:-0.5px;line-height:1.3;">
            Tu código de verificación está listo
            </h2>
            <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.55);
                    line-height:1.7;">
            Alguien (esperamos que seas tú) solicitó crear una cuenta en
            <strong style="color:#4ade80;">Eco-It</strong>. Ingresa el siguiente
            código para activar tu cuenta. Expira en
            <strong style="color:#ffffff;">15 minutos</strong>.
            </p>

        </td>
        </tr>

        <!-- ══ CÓDIGO ════════════════════════════════════════════════════════════ -->
        <tr>
        <td style="background:#0f1a0f;padding:0 44px;
                    border-left:1px solid #166534;border-right:1px solid #166534;">

            <div style="background:#071007;border:1.5px solid #166534;border-radius:16px;
                        padding:28px 24px;text-align:center;
                        box-shadow:0 0 40px rgba(22,163,74,0.15) inset,
                                0 0 0 1px rgba(74,222,128,0.05);">

            <!-- Label -->
            <p style="margin:0 0 14px;font-size:11px;font-weight:700;
                        color:rgba(74,222,128,0.6);letter-spacing:3px;text-transform:uppercase;">
                Código de verificación
            </p>

            <!-- Dígitos del código -->
            <div style="display:inline-block;">
                <span style="font-size:48px;font-weight:900;letter-spacing:12px;
                            color:#4ade80;font-family:'Courier New',monospace;
                            text-shadow:0 0 20px rgba(74,222,128,0.5);">
                ${codigo}
                </span>
            </div>

            <!-- Barra de "progreso" decorativa -->
            <div style="margin:18px auto 0;width:80%;height:2px;
                        background:linear-gradient(90deg,transparent,#22c55e,transparent);
                        border-radius:999px;"></div>

            <p style="margin:12px 0 0;font-size:12px;color:rgba(255,255,255,0.3);">
                ⏱️&nbsp;&nbsp;Válido por 15 minutos · Máx. 5 intentos
            </p>
            </div>

        </td>
        </tr>

        <!-- ══ ADVERTENCIA ═══════════════════════════════════════════════════════ -->
        <tr>
        <td style="background:#0f1a0f;padding:24px 44px 0;
                    border-left:1px solid #166534;border-right:1px solid #166534;">

            <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td style="width:36px;padding-right:12px;vertical-align:top;">
                <div style="width:36px;height:36px;background:rgba(234,179,8,0.1);
                            border:1px solid rgba(234,179,8,0.3);border-radius:10px;
                            text-align:center;line-height:36px;font-size:17px;">
                    ⚠️
                </div>
                </td>
                <td style="vertical-align:top;">
                <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);
                            line-height:1.7;">
                    Si no solicitaste esto, ignora este correo.
                    Tu cuenta <strong style="color:rgba(255,255,255,0.6);">no será creada</strong>
                    hasta que ingreses el código. Nunca compartas este código con nadie.
                </p>
                </td>
            </tr>
            </table>

        </td>
        </tr>

        <!-- ══ SEPARADOR ══════════════════════════════════════════════════════════ -->
        <tr>
        <td style="background:#0f1a0f;padding:28px 44px 0;
                    border-left:1px solid #166534;border-right:1px solid #166534;">
            <div style="height:1px;background:linear-gradient(to right,transparent,#166534,transparent);"></div>
        </td>
        </tr>

        <!-- ══ FOOTER ════════════════════════════════════════════════════════════ -->
        <tr>
        <td style="background:#071007;border:1px solid #166534;border-top:none;
                    border-radius:0 0 20px 20px;padding:22px 44px;text-align:center;">

            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);">
            📅&nbsp;&nbsp;Enviado el&nbsp;&nbsp;<strong style="color:rgba(255,255,255,0.45);">${fecha}</strong>
            </p>
            <p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.6;">
            Este correo fue generado automáticamente por
            <strong style="color:#4ade80;">Eco-It</strong>.
            No respondas a este mensaje.
            </p>

        </td>
        </tr>

    </table>
    </td></tr>
    </table>
    </body>
    </html>`;