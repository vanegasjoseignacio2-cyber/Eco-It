import { Router } from "express";
import OpenAI from "openai";
import User from "../models/user.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

export const aiRouter = Router();

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


// POST /api/ai/consultar
aiRouter.post("/consultar", verificarToken, async (req, res) => {
  const { pregunta } = req.body;

  if (!pregunta || !pregunta.trim()) {
    return res.status(400).json({ error: "La pregunta es obligatoria" });
  }

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await getClient().chat.completions.create({
      model: "openrouter/free",
      messages: [
        { role: "system", content: promptSystem },
        { role: "user", content: pregunta }
      ],
      stream: true
    });

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

    if (respuestaCompleta) {
      await User.findByIdAndUpdate(req.usuario._id, {
        $push: { historialConsultas: { pregunta, respuesta: respuestaCompleta } }
      });
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