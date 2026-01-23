import { GoogleGenerativeAI } from '@google/generative-ai';
import User from '../models/user.js';

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configuración del modelo con parámetros de seguridad
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
  generationConfig: {
    temperature: 0.7,  // Creatividad moderada
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,  // Respuestas no muy largas
  }
});

// Sistema de prompt actualizado con código de colores correcto
const SYSTEM_PROMPT = `
Eres Eco-IA, un asistente ecológico amigable y experto ÚNICAMENTE en reciclaje y gestión de residuos.

PERSONALIDAD:
- Amigable y motivador
- Educativo pero no aburrido
- Usa emojis ocasionalmente (♻️ 🌱 🌍 📦)
- Respuestas claras y estructuradas

TUS FUNCIONES:
1. Identificar tipos de residuos y materiales
2. Indicar contenedores correctos de reciclaje según código de colores:
   - ⚪ BLANCO: Materiales reciclables (papel, cartón, plástico, metal, vidrio)
   - ⚫ NEGRO: Residuos no reciclables (sanitarios, pañales, servilletas, envases contaminados)
   - 🟢 VERDE: Residuos orgánicos (restos de comida, cáscaras, semillas, huesos)
3. Explicar procesos de reciclaje
4. Dar consejos sobre reducción de residuos
5. Informar sobre impacto ambiental

CLASIFICACIÓN DETALLADA POR CONTENEDOR:

⚪ **CONTENEDOR BLANCO (Reciclables):**
- Papel y cartón limpios
- Plásticos (botellas, envases, bolsas)
- Metales (latas de aluminio, acero)
- Vidrio (botellas, frascos)
- Tetrapak y envases multicapa
IMPORTANTE: Deben estar limpios y secos

⚫ **CONTENEDOR NEGRO (No reciclables):**
- Residuos sanitarios (toallas higiénicas, pañales)
- Papel y servilletas usadas
- Envases muy contaminados con comida
- Papel carbón, papel plastificado
- Elementos de un solo uso contaminados
- Colillas de cigarrillo

🟢 **CONTENEDOR VERDE (Orgánicos):**
- Restos de frutas y verduras
- Cáscaras y semillas
- Huesos y espinas
- Restos de comida cocinada
- Cáscaras de huevo
- Bolsas de té, café molido
- Flores y plantas

REGLAS ESTRICTAS:
❌ NO respondas temas fuera de reciclaje/residuos/medio ambiente
❌ Si preguntan algo no relacionado, redirige amablemente
✅ Siempre sé específico con los contenedores (blanco, negro o verde)
✅ Menciona alternativas de reutilización cuando sea posible
✅ Destaca el impacto positivo de reciclar correctamente
✅ Si un material puede ir en varios contenedores según su estado, explica las opciones

FORMATO DE RESPUESTA (cuando analices materiales):
📋 Material identificado: [nombre]
♻️ Contenedor: [emoji y color] - [Tipo]
💡 Preparación: [cómo prepararlo antes de desechar]
🌍 Impacto: [dato ambiental breve]

Si la pregunta NO es sobre reciclaje, responde:
"¡Hola! 👋 Soy tu asistente especializado en reciclaje. Solo puedo ayudarte con dudas sobre gestión de residuos y reciclaje. ¿Tienes alguna pregunta sobre cómo clasificar tus residuos? 🌱♻️"
`;

// Controlador: Consultar a la IA (solo texto)
export const consultarIA = async (req, res) => {
  try {
    const { pregunta } = req.body;

    // 1. Validaciones
    if (!pregunta || pregunta.trim() === '') {
      return res.status(400).json({
        success: false,
        mensaje: 'Debes enviar una pregunta'
      });
    }

    if (pregunta.length > 500) {
      return res.status(400).json({
        success: false,
        mensaje: 'La pregunta es demasiado larga (máximo 500 caracteres)'
      });
    }

    // 2. Construir prompt
    const promptCompleto = `${SYSTEM_PROMPT}\n\nPregunta del usuario: ${pregunta}\n\nRespuesta:`;

    // 3. Llamar a Gemini con timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout de la IA')), 15000)
    );

    const generationPromise = model.generateContent(promptCompleto);

    const result = await Promise.race([generationPromise, timeoutPromise]);
    const response = await result.response;
    const respuesta = response.text();

    // 4. Verificar si la respuesta está vacía
    if (!respuesta || respuesta.trim() === '') {
      return res.status(500).json({
        success: false,
        mensaje: 'La IA no pudo generar una respuesta'
      });
    }

    // 5. Guardar en historial
    const usuario = await User.findById(req.usuario.id);
    
    usuario.historialConsultas.push({
      pregunta: pregunta.trim(),
      respuesta: respuesta.trim(),
      imagen: null,
      fecha: new Date()
    });

    await usuario.save();

    // 6. Responder
    res.status(200).json({
      success: true,
      mensaje: 'Consulta procesada exitosamente',
      data: {
        pregunta: pregunta.trim(),
        respuesta: respuesta.trim(),
        consultaId: usuario.historialConsultas[usuario.historialConsultas.length - 1]._id,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Error en consultarIA:', error);
    
    // Manejo específico de errores
    if (error.message === 'Timeout de la IA') {
      return res.status(408).json({
        success: false,
        mensaje: 'La IA tardó demasiado en responder. Intenta de nuevo.'
      });
    }

    res.status(500).json({
      success: false,
      mensaje: 'Error al consultar la IA',
      error: error.message
    });
  }
};

// Controlador: Analizar imagen de residuo
export const analizarImagen = async (req, res) => {
  try {
    const { imagen, contexto } = req.body;

    // 1. Validaciones
    if (!imagen) {
      return res.status(400).json({
        success: false,
        mensaje: 'Debes enviar una imagen'
      });
    }

    // Validar que sea base64 válido
    if (!imagen.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        mensaje: 'Formato de imagen inválido. Debe ser base64.'
      });
    }

    // Limitar tamaño de contexto
    if (contexto && contexto.length > 300) {
      return res.status(400).json({
        success: false,
        mensaje: 'El contexto es demasiado largo (máximo 300 caracteres)'
      });
    }

    // 2. Preparar imagen para Gemini
    const imageData = imagen.split(',')[1];
    const mimeType = imagen.match(/data:([^;]+);/)[1];

    const imageParts = [
      {
        inlineData: {
          data: imageData,
          mimeType: mimeType
        }
      }
    ];

    // 3. Prompt específico para análisis de imágenes
    const promptImagen = `
${SYSTEM_PROMPT}

TAREA ESPECÍFICA: Analiza la imagen de este residuo/material.

${contexto ? `CONTEXTO DEL USUARIO: "${contexto}"` : ''}

RESPONDE EN ESTE FORMATO:

📋 **Material identificado:** [nombre específico del material/objeto]

♻️ **Contenedor correcto:** 
[Emoji] [COLOR] - [Explicación breve del tipo de residuo]

Opciones de contenedores:
- ⚪ BLANCO: Si es reciclable (papel, cartón, plástico, metal, vidrio)
- ⚫ NEGRO: Si es no reciclable (sanitarios, contaminados, etc.)
- 🟢 VERDE: Si es orgánico (restos de comida, cáscaras, etc.)

💡 **Cómo prepararlo:**
- [Instrucciones específicas: limpiar, secar, separar partes, etc.]
- [Pasos adicionales si aplica]

🌍 **Dato ecológico:**
[Impacto positivo de clasificarlo correctamente o dato interesante sobre su reciclaje]

⚠️ **Importante:** [Advertencias o consideraciones especiales si las hay]

💭 **Consejo extra:** [Tip para reducir, reutilizar o alternativa sustentable]

Sé específico y práctico. Si el material tiene varias partes (ej: botella con tapa), indica cómo separarlo.
`;

    // 4. Llamar a Gemini con timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout de la IA')), 20000)
    );

    const generationPromise = model.generateContent([promptImagen, ...imageParts]);

    const result = await Promise.race([generationPromise, timeoutPromise]);
    const response = await result.response;
    const respuesta = response.text();

    // 5. Validar respuesta
    if (!respuesta || respuesta.trim() === '') {
      return res.status(500).json({
        success: false,
        mensaje: 'La IA no pudo analizar la imagen'
      });
    }

    // 6. Guardar en historial (guardamos solo referencia, no la imagen completa para ahorrar espacio)
    const usuario = await User.findById(req.usuario.id);
    
    usuario.historialConsultas.push({
      pregunta: contexto || 'Análisis de imagen de residuo',
      respuesta: respuesta.trim(),
      imagen: imagen.substring(0, 100) + '...',  // Solo guardamos inicio para referencia
      fecha: new Date()
    });

    await usuario.save();

    // 7. Responder
    res.status(200).json({
      success: true,
      mensaje: 'Imagen analizada exitosamente',
      data: {
        respuesta: respuesta.trim(),
        consultaId: usuario.historialConsultas[usuario.historialConsultas.length - 1]._id,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Error en analizarImagen:', error);
    
    if (error.message === 'Timeout de la IA') {
      return res.status(408).json({
        success: false,
        mensaje: 'El análisis tardó demasiado. La imagen puede ser muy grande o compleja.'
      });
    }

    res.status(500).json({
      success: false,
      mensaje: 'Error al analizar la imagen',
      error: error.message
    });
  }
};

// Controlador: Obtener sugerencias rápidas
export const obtenerSugerencias = async (req, res) => {
  try {
    const sugerencias = [
      "¿Cómo reciclo plástico correctamente?",
      "¿Qué materiales van en el contenedor blanco?",
      "¿Cómo puedo reducir mi huella de carbono?",
      "¿Dónde puedo reciclar electrónicos?",
      "¿El papel aluminio es reciclable?",
      "¿Cómo separar residuos orgánicos?",
      "¿Los pañales son reciclables?",
      "¿Qué hacer con botellas de vidrio?",
      "¿Cómo reciclar cartón de pizza?",
      "¿Las latas de aluminio van en qué contenedor?"
    ];

    res.status(200).json({
      success: true,
      data: sugerencias
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener sugerencias'
    });
  }
};