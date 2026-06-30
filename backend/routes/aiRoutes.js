import { Router } from "express";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Chat from "../models/chat.js";
import Notification from "../models/notification.js";
import { verificarToken, verificarBaneo } from "../middlewares/authMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contextoColombia = fs.readFileSync(
  path.join(__dirname, "../data/colombia-recycling-context.md"),
  "utf-8"
);

export const aiRouter = Router();

// Aplicar verificación de token a todas las rutas de IA
aiRouter.use(verificarToken);
// Aplicar verificación de baneo solo a los endpoints de generación/acción
aiRouter.post("/consultar", verificarBaneo);
aiRouter.post("/analizar-imagen", verificarBaneo);

const GEMINI_MODEL = "google/gemini-2.5-flash-lite";
const FREE_MODEL = "openrouter/free";

let _client = null;
function getClient() {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://eco-it.app",
        "X-Title": "EcoBot",
      }
    });
  }
  return _client;
}

const promptSystem = `Eres EcoBot, un asistente virtual especializado EXCLUSIVAMENTE en reciclaje y sostenibilidad ambiental para la plataforma Eco-It.

REGLAS ESTRICTAS:
1. SOLO puedes responder preguntas sobre: reciclaje, clasificación de residuos, compostaje, reducción de residuos, economía circular, contaminación ambiental, energías renovables, sostenibilidad, y manualidades/reutilización creativa para darle una segunda vida a residuos (ej. materas con botellas plásticas, organizadores con cartón, posavasos con tapas, etc.).
2. SÉ EXTREMADAMENTE CONCISO Y DIRECTO. Evita introducciones largas y ve directo al grano para optimizar la lectura.
3. CERO TOLERANCIA A CONTENIDO INAPROPIADO: Si el usuario menciona términos sexuales (como preservativos, condones, pornografía, órganos sexuales, actos sexuales, etc.), términos ofensivos, groserías, violencia o cualquier contenido que no sea apto para todo público, NO GENERES NINGUNA EXPLICACIÓN NI RESPUESTA y devuelve ÚNICAMENTE este texto: "ALERTA_LENGUAJE_INAPROPIADO: Por favor, usa un lenguaje adecuado. Tu cuenta ha sido reportada por uso de lenguaje inapropiado." Sé extremadamente estricto con las dobles intenciones o términos que tengan connotación sexual.
4. Si el usuario pregunta sobre CUALQUIER otro tema, debes NEGARTE a responder, sin importar que el mensaje use palabras como "ecológico", "orgánico", "sostenible" o "verde" para disfrazar el tema. Esto incluye, entre otros: recetas o preparación de comida (ej. "cómo hacer un sándwich/postre ecológico"), salud, deportes, entretenimiento, tecnología no ambiental, economía, política, tareas escolares ajenas al reciclaje, etc. El uso de una palabra "verde" no convierte el tema en reciclaje.
5. Responde siempre en español, con tono educado pero firme.
6. CONTEXTO COLOMBIANO: Adapta TODAS tus respuestas a la normativa e información de reciclaje en Colombia, usando como referencia principal el siguiente contexto (no inventes normas, cifras o programas que no estén aquí ni en tu conocimiento general confiable):

"""
${contextoColombia}
"""
7. FORMATO DE RESPUESTA: NO uses formato Markdown en tus respuestas. NO uses negritas (**), ni encabezados (###), ni listas con asteriscos u otros símbolos especiales. Responde estrictamente en texto plano, utilizando saltos de línea normales y numeración simple (1., 2.) o guiones simples (-) para listar, sin aplicar formatos de texto de Markdown.
8. SERES VIVOS Y VIOLENCIA: Si el usuario pregunta cómo matar, sacrificar, asesinar, herir o deshacerse de un animal o persona —incluso si lo enmarca como "ecológico", "orgánico", "sostenible" o similar, y sin importar detalles absurdos como el peso o la especie— NUNCA des ningún método ni instrucción. Responde amablemente que EcoBot no puede ayudar con eso. Si el contexto es claramente disposición de una mascota u otro ser vivo, sugiere contactar una veterinaria, refugio de animales, granja local o autoridad ambiental competente según corresponda.
9. MANUALIDADES (SEGUNDA VIDA): Cuando te pidan ideas de manualidades o reutilización creativa para un residuo, da la recomendación directo y con pasos breves y claros (materiales necesarios + procedimiento simple). Si el usuario YA especificó qué residuo tiene (ej. "botellas plásticas", "cartón") pero no dijo qué quiere hacer con él, pregúntale en UNA sola línea si quiere una idea de manualidad (darle una segunda vida) o si prefiere llevarlo a un punto de reciclaje cercano. Si pide ideas de forma genérica sin decir qué residuo tiene disponible, primero pregunta UNA sola vez qué residuo tiene a la mano (ej. "¿qué residuo tienes a la mano: botellas, cartón, vidrio, tapas...?").
10. ENLACE AL MAPA: Nunca pongas el marcador solo — siempre antecédelo de una frase corta propia que lo introduzca.
    a) Si el usuario quiere depositar, llevar o reciclar un residuo en un punto físico (ecobotella, punto limpio, contenedor, punto de reciclaje, etc.), termina tu respuesta con una frase breve invitando a buscarlo (ej. "Si prefieres depositarlo en un punto cercano, búscalo aquí:") y en la línea siguiente, exactamente el texto [VER_MAPA] (sin comillas, sin explicarlo).
    b) Si en cambio diste una idea de manualidad, ofrece el mapa como alternativa al final con una frase similar (ej. "O si prefieres depositarlas en un punto de reciclaje en vez de la manualidad, búscalo aquí:") seguida en su propia línea de [VER_MAPA].
    La aplicación convierte automáticamente [VER_MAPA] en un botón hacia el mapa de puntos de reciclaje. Nunca digas la palabra "VER_MAPA" dentro de una oración ni expliques qué es.
11. ENLACE A VIDEO TUTORIAL: Cuando des una idea de manualidad, puedes ofrecer un tutorial en video. Termina con una frase corta (ej. "Si prefieres verlo en video:") seguida, en su propia línea, de exactamente [VER_VIDEO: consulta corta en español] — reemplaza "consulta corta en español" por 3 a 6 palabras que describan el tutorial a buscar (ej. [VER_VIDEO: matera con botellas plasticas paso a paso]). NUNCA inventes una URL, ID de video ni nombre de canal: solo la consulta de búsqueda, la aplicación arma el enlace de búsqueda en YouTube por ti. Úsalo como máximo una vez por respuesta, solo en respuestas de manualidades, nunca si la pregunta no fue sobre eso.

Cuando rechaces un tema fuera de tu especialidad, usa exactamente este mensaje:
"Lo siento, solo puedo ayudarte con temas relacionados al reciclaje y la sostenibilidad ambiental. ¿Tienes alguna pregunta sobre cómo reciclar?"`;

const promptImagen = `Eres EcoBot, un asistente visual especializado EXCLUSIVAMENTE en reciclaje y sostenibilidad ambiental para la plataforma Eco-It.

REGLAS ESTRICTAS:
1. Analiza la imagen proporcionada SOLO desde la perspectiva del reciclaje y medio ambiente.
2. Sé totalmente CONCISO y DIRECTO. Minimiza la cantidad de texto al máximo.
3. FILTRO DE CONTENIDO (CERO TOLERANCIA): Si detectas explícitamente contenido obsceno, desnudez, índole sexual o violencia en la imagen o contexto, tu respuesta DEBE comenzar obligatoriamente con la palabra EXACTA "ALERTA_OBSCENA:". Seguido de eso, responde únicamente: "El envío de contenido inapropiado no está permitido y ha sido reportado."
4. Si la imagen NO es de reciclaje pero tampoco es obscena (ej. una silla, un zapato normal, paisaje), simplemente indica de forma amigable que solo puedes analizar elementos relacionados con sostenibilidad. NO uses la frase "ALERTA_OBSCENA:" en este caso.
5. Identifica materiales reciclables y sugiere cómo desecharlos brevemente.
6. Responde siempre en español.
7. CONTEXTO COLOMBIANO: Tus sugerencias sobre cómo desechar materiales deben basarse en la normativa colombiana de clasificación, indicando el color de la caneca correspondiente (Blanco: aprovechables, Negro: no aprovechables, Verde: orgánicos).
8. FORMATO DE RESPUESTA: NO uses formato Markdown en tus respuestas. NO uses negritas (**), ni encabezados (###), ni listas con asteriscos u otros símbolos especiales. Responde estrictamente en texto plano.`;


/**
 * Helper para registrar una alerta de contenido inapropiado sin banear al usuario (excepto imágenes)
 */
async function registrarAlertaContenido(req, razon, imagen = null) {
  try {
    const isImage = !!imagen;
    console.log(`[EcoBot] Registrando alerta: ${isImage ? 'IMAGEN' : 'LENGUAJE'}. Razón: ${razon}`);

    // Baneo automático por 3 días si es imagen obscena
    if (isImage) {
      req.usuario.status = 'banned';
      const banHasta = new Date();
      banHasta.setDate(banHasta.getDate() + 3);
      req.usuario.banHasta = banHasta;
      req.usuario.banReason = "Sistema: Envío de imagen con contenido obsceno.";
      await req.usuario.save();
      console.log(`[EcoBot] Usuario ${req.usuario.email} baneado automáticamente.`);
    }

    const notifAlertaData = {
      type: isImage ? "alerta_obscena" : "alerta_lenguaje",
      email: req.usuario.email,
      nombre: req.usuario.nombre,
      fecha: new Date(),
      mensaje: isImage 
        ? "Se detectó el envío de una imagen con contenido obsceno/inapropiado."
        : "Se detectó el uso de lenguaje inapropiado/sexual en el chat."
    };

    const notifAlerta = await Notification.create(notifAlertaData);
    console.log(`[EcoBot] Notificación guardada en BD con ID: ${notifAlerta._id}`);

    const io = req.app.get("io");
    if (io) {
      const adminsRoom = io.sockets.adapter.rooms.get("admins");
      console.log(`[EcoBot] Emitiendo eventos a sala 'admins' (Usuarios conectados: ${adminsRoom ? adminsRoom.size : 0})...`);
      if (isImage) {
        io.to("admins").emit("admin:alerta_obscena", {
          ...notifAlertaData,
          id: notifAlerta._id,
          imagen: imagen
        });
        // Crear y guardar la notificación de baneo en la base de datos para que tenga un ID real
        const notifBan = await Notification.create({
          type: "usuario_baneado",
          email: req.usuario.email,
          nombre: req.usuario.nombre,
          adminName: "Sistema Automático",
          dias: 3,
          fecha: new Date(),
          mensaje: `Baneo automático de 3 días aplicado por el sistema.`
        });

        // Emitir la notificación de baneo con su ID de base de datos
        io.to("admins").emit("admin:usuario_baneado", {
          ...notifBan.toObject(),
          id: notifBan._id
        });
      } else {
        io.to("admins").emit("admin:alerta_lenguaje", {
          ...notifAlertaData,
          id: notifAlerta._id
        });
      }
      console.log(`[EcoBot] Eventos emitidos exitosamente.`);
    } else {
      console.warn("[EcoBot] No se encontró el objeto IO en la aplicación.");
    }
  } catch (error) {
    console.error("❌ Error en registrarAlertaContenido:", error);
  }
}

/**
 * Verifica si un error indica que la cuota del modelo gratuito se agotó.
 */
function esErrorDeCuota(error) {
  const status = error?.status || error?.response?.status;
  if (status === 429 || status === 402) return true;

  const msg = (error?.message || error?.error?.message || "").toLowerCase();
  return msg.includes("rate_limit") ||
    msg.includes("quota") ||
    msg.includes("limit exceeded") ||
    msg.includes("insufficient") ||
    msg.includes("credits");
}

/**
 * Crea un stream de chat con el modelo indicado.
 */
async function crearStream(modelo, mensajes) {
  return getClient().chat.completions.create({
    model: modelo,
    messages: mensajes,
    stream: true,
  });
}

/**
 * Lógica para mantener un límite de 50 chats por usuario
 */
async function mantenerLimiteChats(userId) {
  const limit = 50;
  const count = await Chat.countDocuments({ userId });
  if (count > limit) {
    const excesos = count - limit;
    const chatsAntiguos = await Chat.find({ userId })
      .sort({ updatedAt: 1 })
      .limit(excesos)
      .select('_id');

    const idsAEliminar = chatsAntiguos.map(chat => chat._id);
    await Chat.deleteMany({ _id: { $in: idsAEliminar } });
  }
}

// -----------------------------------------------------
// --------------- NUEVOS ENDPOINTS PARA CHATS -----------
// -----------------------------------------------------

// GET /api/ai/chats
aiRouter.get("/chats", async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.usuario._id })
      .sort({ updatedAt: -1 })
      .select('_id title updatedAt');
    res.json(chats);
  } catch (error) {
    console.error("Error al obtener chats:", error);
    res.status(500).json({ error: "Error al obtener historial de chats" });
  }
});

// GET /api/ai/chats/:id
aiRouter.get("/chats/:id", async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.usuario._id });
    if (!chat) return res.status(404).json({ error: "Chat no encontrado" });
    res.json(chat);
  } catch (error) {
    console.error("Error al obtener chat:", error);
    res.status(500).json({ error: "Error al obtener detalles del chat" });
  }
});

// DELETE /api/ai/chats/:id
aiRouter.delete("/chats/:id", async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.usuario._id });
    if (!chat) return res.status(404).json({ error: "Chat no encontrado" });
    res.json({ success: true, message: "Chat eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar chat:", error);
    res.status(500).json({ error: "Error al eliminar chat" });
  }
});

// DELETE /api/ai/chats (Todos los chats del usuario)
aiRouter.delete("/chats", async (req, res) => {
  try {
    await Chat.deleteMany({ userId: req.usuario._id });
    res.json({ success: true, message: "Todos los chats han sido eliminados" });
  } catch (error) {
    console.error("Error al eliminar todos los chats:", error);
    res.status(500).json({ error: "Error al eliminar todos los chats" });
  }
});

// -----------------------------------------------------

// POST /api/ai/consultar
aiRouter.post("/consultar", async (req, res) => {
  const { pregunta, chatId } = req.body;

  if (!pregunta || !pregunta.trim()) {
    return res.status(400).json({ error: "La pregunta es obligatoria" });
  }

  let chatActual;
  let arrayMensajesModelo = [{ role: "system", content: promptSystem }];

  try {
    // 1. Obtener o crear chat
    if (chatId) {
      chatActual = await Chat.findOne({ _id: chatId, userId: req.usuario._id });
      if (!chatActual) return res.status(404).json({ error: "Chat no encontrado" });

      // Añadir historial al contexto del modelo (solo rol y contenido aplicable)
      // Evitamos pasar imagenes porque requeriría el modelo multimodal Gemini por defecto. 
      // Si queremos imágenes viejas, habría que usar siempre gemini. Por simplicidad pasamos todo texto.
      for (const tMsg of chatActual.mensajes) {
        if (tMsg.role === 'user' || tMsg.role === 'bot') {
          const mapRole = tMsg.role === 'bot' ? 'assistant' : 'user';
          // Evitamos mensajes sin contenido de texto (si subió solo imagen)
          if (tMsg.content && tMsg.content !== "📷 Imagen enviada para análisis") {
            arrayMensajesModelo.push({ role: mapRole, content: tMsg.content });
          }
        }
      }
    } else {
      // Crear uno nuevo
      chatActual = new Chat({
        userId: req.usuario._id,
        title: pregunta.substring(0, 40) + (pregunta.length > 40 ? "..." : ""),
        mensajes: []
      });
      await chatActual.save();
      await mantenerLimiteChats(req.usuario._id);
    }

    // 2. Añadir pregunta actual
    arrayMensajesModelo.push({ role: "user", content: pregunta });

    // Iniciar streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Mandar el ID del chat si fue creado / existe
    res.write(`data: ${JSON.stringify({ chatId: chatActual._id })}\n\n`);

    let stream;
    let modeloUsado = FREE_MODEL;

    try {
      stream = await crearStream(FREE_MODEL, arrayMensajesModelo);
    } catch (error) {
      if (esErrorDeCuota(error)) {
        console.warn("⚠️ Cuota de openrouter/free agotada. Usando Gemini como fallback...");
        modeloUsado = GEMINI_MODEL;
        stream = await crearStream(GEMINI_MODEL, arrayMensajesModelo);
      } else {
        throw error;
      }
    }

    let respuestaCompleta = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        respuestaCompleta += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

    // 3. Guardar mensajes en la base de datos
    if (respuestaCompleta) {
      try {
        // Verificar si hubo una alerta de lenguaje inapropiado (insensible a mayúsculas)
        const upperRes = respuestaCompleta.toUpperCase();
        if (upperRes.includes("ALERTA_LENGUAJE_INAPROPIADO") || upperRes.includes("CONTENIDO INAPROPIADO")) {
          await registrarAlertaContenido(req, "Lenguaje explícito e inapropiado");
        }

        chatActual.mensajes.push({ role: "user", content: pregunta });
        chatActual.mensajes.push({ role: "bot", content: respuestaCompleta });
        chatActual.updatedAt = Date.now();
        await chatActual.save();
      } catch (saveError) {
        console.error("Error al guardar mensajes en segundo plano:", saveError);
      }
    }

    if (modeloUsado === GEMINI_MODEL) {
      console.log("✅ Respuesta generada con Gemini (fallback).");
    }
  } catch (error) {
    console.error("Error OpenRouter:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Error al generar la respuesta" });
    }
    res.write(`data: ${JSON.stringify({ error: "Error al generar la respuesta" })}\n\n`);
    res.end();
  }
});


// POST /api/ai/analizar-imagen
aiRouter.post("/analizar-imagen", async (req, res) => {
  const { imagen, contexto, chatId } = req.body;

  if (!imagen) {
    return res.status(400).json({ error: "La imagen es obligatoria" });
  }

  let chatActual;

  try {
    if (chatId) {
      chatActual = await Chat.findOne({ _id: chatId, userId: req.usuario._id });
      if (!chatActual) return res.status(404).json({ error: "Chat no encontrado" });
    } else {
      chatActual = new Chat({
        userId: req.usuario._id,
        title: contexto ? contexto.substring(0, 40) + "..." : "Análisis de imagen",
        mensajes: []
      });
      await chatActual.save();
      await mantenerLimiteChats(req.usuario._id);
    }

    const userContent = [
      {
        type: "image_url",
        image_url: { url: imagen },
      },
    ];

    if (contexto && contexto.trim()) {
      userContent.push({
        type: "text",
        text: contexto,
      });
    } else {
      userContent.push({
        type: "text",
        text: "Analiza esta imagen desde la perspectiva del reciclaje y sostenibilidad ambiental.",
      });
    }

    const completion = await getClient().chat.completions.create({
      model: GEMINI_MODEL,
      messages: [
        { role: "system", content: promptImagen },
        { role: "user", content: userContent },
      ],
    });

    let respuesta = completion.choices[0]?.message?.content || "No pude analizar la imagen.";

    // Verificar si la IA consideró la imagen obscena
    if (respuesta.includes("ALERTA_OBSCENA:")) {
      await registrarAlertaContenido(req, "Contenido imagen inapropiado", imagen);
      // El usuario fue baneado por el sistema en registrarAlertaContenido
    }

    // Guardar en la DB
    chatActual.mensajes.push({ role: "user", content: contexto || "📷 Análisis de imagen", imagen: imagen });
    chatActual.mensajes.push({ role: "bot", content: respuesta });
    chatActual.updatedAt = Date.now();
    await chatActual.save();

    res.json({ success: true, data: { respuesta, chatId: chatActual._id } });
  } catch (error) {
    console.error("Error al analizar imagen con Gemini:", error);
    res.status(500).json({
      error: "Error al analizar la imagen. Intenta de nuevo.",
    });
  }
});