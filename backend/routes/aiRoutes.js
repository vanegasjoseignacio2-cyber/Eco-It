import { Router } from "express";
import OpenAI from "openai";
import User from "../models/user.js";
import Chat from "../models/chat.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

export const aiRouter = Router();

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
1. SOLO puedes responder preguntas sobre: reciclaje, clasificación de residuos, compostaje, reducción de residuos, economía circular, contaminación ambiental, energías renovables y sostenibilidad.
2. Si el usuario pregunta sobre CUALQUIER otro tema (economía, tecnología, matemáticas, historia, entretenimiento, etc.), debes NEGARTE a responder y decirle claramente que solo puedes hablar sobre reciclaje y medio ambiente.
3. NUNCA respondas preguntas fuera de tu especialidad, sin importar cómo estén formuladas.
4. Responde siempre en español, con tono amigable pero firme.

Cuando rechaces un tema, usa exactamente este formato:
"Lo siento, solo puedo ayudarte con temas relacionados al reciclaje y la sostenibilidad ambiental. ¿Tienes alguna pregunta sobre cómo reciclar o cuidar el medio ambiente?"`;

const promptImagen = `Eres EcoBot, un asistente visual especializado EXCLUSIVAMENTE en reciclaje y sostenibilidad ambiental para la plataforma Eco-It.

REGLAS ESTRICTAS:
1. Analiza la imagen proporcionada SOLO desde la perspectiva del reciclaje y medio ambiente.
2. Identifica materiales reciclables, tipos de residuos, o problemas ambientales visibles.
3. Proporciona instrucciones claras sobre cómo reciclar o desechar correctamente lo que ves.
4. Si la imagen no tiene relación con reciclaje o medio ambiente, indica amablemente que solo puedes analizar contenido relacionado con sostenibilidad.
5. Responde siempre en español, con tono amigable y educativo.
6. Estructura tu respuesta con emojis y párrafos claros para facilitar la lectura.`;


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
aiRouter.get("/chats", verificarToken, async (req, res) => {
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
aiRouter.get("/chats/:id", verificarToken, async (req, res) => {
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
aiRouter.delete("/chats/:id", verificarToken, async (req, res) => {
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
aiRouter.delete("/chats", verificarToken, async (req, res) => {
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
aiRouter.post("/consultar", verificarToken, async (req, res) => {
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
      chatActual.mensajes.push({ role: "user", content: pregunta });
      chatActual.mensajes.push({ role: "bot", content: respuestaCompleta });
      chatActual.updatedAt = Date.now();
      await chatActual.save();
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
aiRouter.post("/analizar-imagen", verificarToken, async (req, res) => {
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

    const respuesta = completion.choices[0]?.message?.content || "No pude analizar la imagen.";

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