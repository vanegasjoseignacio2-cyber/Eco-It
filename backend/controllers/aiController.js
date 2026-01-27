import { GoogleGenerativeAI } from '@google/generative-ai';
import User from '../models/user.js';

// Variables para almacenamiento lazy
let genAI = null;
let model = null;

// Función para obtener el modelo (Lazy Initialization)
const getModel = () => {
  if (!model) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY no está definida en las variables de entorno');
    }
    console.log('✨ Inicializando cliente Gemini...');
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
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
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
  }
  return model;
};

// Función para generar respuestas locales (Lógica del usuario preservada)
function generarRespuestaLocal(pregunta) {
  const preguntaLower = pregunta.toLowerCase();

  // Detectar palabras clave
  if (preguntaLower.includes('plástico') || preguntaLower.includes('plastico') || preguntaLower.includes('botella')) {
    return `📋 **Material identificado:** Plástico/Botellas\n\n♻️ **Contenedor:** ⚪ BLANCO - Materiales reciclables\n\n💡 **Preparación:**\n- Enjuaga la botella para eliminar residuos\n- Retira etiquetas si es posible\n- Aplasta la botella para ahorrar espacio\n- Tapa y botella van juntas al contenedor blanco\n\n🌍 **Impacto:** Una botella de plástico puede tardar hasta 450 años en degradarse. ¡Reciclarla ahorra energía y reduce la contaminación!\n\n⚠️ **Importante:** Solo plásticos limpios y secos. Si están muy sucios, van al contenedor negro.`;
  }

  if (preguntaLower.includes('papel') || preguntaLower.includes('cartón') || preguntaLower.includes('carton')) {
    return `📋 **Material identificado:** Papel y cartón\n\n♻️ **Contenedor:** ⚪ BLANCO - Materiales reciclables\n\n💡 **Preparación:**\n- Debe estar limpio y seco\n- Quita grapas, clips y cintas adhesivas\n- Aplana las cajas de cartón\n- NO incluyas papel encerado, plastificado o sucio\n\n🌍 **Impacto:** Reciclar papel salva árboles y reduce el consumo de agua en un 60%.\n\n💭 **Consejo extra:** El cartón de pizza con grasa va al contenedor negro (no reciclable).`;
  }

  if (preguntaLower.includes('vidrio') || preguntaLower.includes('cristal')) {
    return `📋 **Material identificado:** Vidrio\n\n♻️ **Contenedor:** ⚪ BLANCO - Materiales reciclables\n\n💡 **Preparación:**\n- Enjuaga para eliminar residuos\n- No es necesario quitar etiquetas\n- Retira tapas metálicas o plásticas\n- Deposita completo (no roto en bolsas)\n\n🌍 **Impacto:** El vidrio es 100% reciclable infinitas veces sin perder calidad.\n\n⚠️ **Importante:** Los espejos, cristales de ventanas y bombillas NO van aquí.`;
  }

  if (preguntaLower.includes('orgánico') || preguntaLower.includes('organico') || preguntaLower.includes('comida') || preguntaLower.includes('fruta') || preguntaLower.includes('verdura')) {
    return `📋 **Material identificado:** Residuos orgánicos\n\n♻️ **Contenedor:** 🟢 VERDE - Residuos orgánicos\n\n💡 **Qué va aquí:**\n- Restos de frutas y verduras\n- Cáscaras de huevo\n- Posos de café y bolsitas de té\n- Restos de comida cocinada\n- Huesos pequeños\n- Flores y plantas\n\n🌍 **Impacto:** Los residuos orgánicos se convierten en compost, un excelente fertilizante natural.\n\n💭 **Consejo extra:** Evita carnes y huesos grandes que tardan más en descomponerse.`;
  }

  if (preguntaLower.includes('metal') || preguntaLower.includes('lata') || preguntaLower.includes('aluminio')) {
    return `📋 **Material identificado:** Metal/Latas\n\n♻️ **Contenedor:** ⚪ BLANCO - Materiales reciclables\n\n💡 **Preparación:**\n- Enjuaga las latas\n- Aplasta para ahorrar espacio\n- No es necesario quitar etiquetas\n- Latas de aluminio y acero van juntas\n\n🌍 **Impacto:** Reciclar aluminio ahorra el 95% de la energía necesaria para producir aluminio nuevo.\n\n💭 **Consejo extra:** Una lata de aluminio puede reciclarse infinitas veces.`;
  }

  if (preguntaLower.includes('basura') || preguntaLower.includes('clasificar') || preguntaLower.includes('separar')) {
    return `🌱 **Guía de clasificación de residuos:**\n\n**⚪ CONTENEDOR BLANCO (Reciclables):**\n- Papel y cartón limpios\n- Plásticos (botellas, envases)\n- Vidrio (botellas, frascos)\n- Metales (latas, aluminio)\n- Tetrapak\n\n**⚫ CONTENEDOR NEGRO (No reciclables):**\n- Pañales y productos sanitarios\n- Papel sucio o contaminado\n- Envases muy sucios\n- Papel plastificado\n- Colillas de cigarrillo\n\n**🟢 CONTENEDOR VERDE (Orgánicos):**\n- Restos de frutas y verduras\n- Cáscaras\n- Restos de comida\n- Café y té\n- Flores y plantas\n\n💡 **Regla de oro:** Limpio y seco = reciclable. Sucio = contenedor negro.\n\n¿Tienes algún residuo específico que quieras clasificar?`;
  }

  // Respuesta por defecto
  return `🌱 **Eco-IA - Asistente de Reciclaje**\n\nSoy tu asistente especializado en reciclaje. Puedo ayudarte a:\n\n♻️ Clasificar residuos según el código de colores:\n- ⚪ BLANCO: Reciclables\n- ⚫ NEGRO: No reciclables\n- 🟢 VERDE: Orgánicos\n\n💡 Para ayudarte mejor, dime qué tipo de residuo quieres clasificar. Por ejemplo:\n- "¿Dónde va una botella de plástico?"\n- "¿Cómo reciclo cartón?"\n- "¿Las cáscaras de frutas dónde van?"\n\nTambién puedes enviarme una foto del residuo para que lo identifique. 📸\n\n¿En qué puedo ayudarte hoy?`;
}

// Sistema de prompt actualizado con código de colores correcto
const SYSTEM_PROMPT = `
Eres Eco-IA, un asistente ecológico amigable y experto ÚNICAMENTE en reciclaje y gestión de residuos.
CÓDIGO DE COLORES:
- ⚪ BLANCO: Materiales reciclables (papel, cartón, plástico, metal, vidrio)
- ⚫ NEGRO: Residuos no reciclables (sanitarios, pañales, servilletas, envases contaminados)
- 🟢 VERDE: Residuos orgánicos (restos de comida, cáscaras, semillas, huesos)
FORMATO DE RESPUESTA:
📋 Material identificado: [nombre]
♻️ Contenedor: [emoji y color]
💡 Preparación: [instrucciones]
🌍 Impacto: [dato ambiental]
Si la pregunta NO es sobre reciclaje, responde amablemente que solo puedes ayudar con eso.
`;

// Controlador: Consultar a la IA (solo texto)
export const consultarIA = async (req, res) => {
  try {
    console.log('📥 Petición recibida en /ai/consultar');
    const { pregunta } = req.body;

    // Validaciones
    if (!pregunta || pregunta.trim() === '') {
      return res.status(400).json({ success: false, mensaje: 'Debes enviar una pregunta' });
    }

    if (pregunta.length > 500) {
      return res.status(400).json({ success: false, mensaje: 'La pregunta es demasiado larga' });
    }

    let respuesta;

    // Intentar usar Gemini
    try {
      const modelInstance = getModel();
      const promptCompleto = `${SYSTEM_PROMPT}\n\nPregunta del usuario: ${pregunta}\n\nRespuesta:`;

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout de la IA')), 15000)
      );

      const generationPromise = modelInstance.generateContent(promptCompleto);
      const result = await Promise.race([generationPromise, timeoutPromise]);
      const response = await result.response;
      respuesta = response.text();

      // Validar respuesta vacía
      if (!respuesta) throw new Error('Respuesta vacía de Gemini');

    } catch (error) {
      console.warn('⚠️ Fallo Gemini o sin API Key. Usando modo offline (Local).', error.message);
      // Fallback a lógica local
      respuesta = generarRespuestaLocal(pregunta);
    }

    // Guardar en historial
    const usuario = await User.findById(req.usuario.id);

    usuario.historialConsultas.push({
      pregunta: pregunta.trim(),
      respuesta: respuesta.trim(),
      imagen: null,
      fecha: new Date()
    });

    await usuario.save();

    // Responder
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
    res.status(500).json({
      success: false,
      mensaje: 'Error al consultar la IA (Fatal)',
      error: error.message
    });
  }
};

// Controlador: Analizar imagen de residuo
export const analizarImagen = async (req, res) => {
  try {
    const { imagen, contexto } = req.body;

    // Validaciones
    if (!imagen) return res.status(400).json({ success: false, mensaje: 'Debes enviar una imagen' });
    if (!imagen.startsWith('data:image/')) return res.status(400).json({ success: false, mensaje: 'Formato inválido' });

    let respuesta;

    // Intentar usar Gemini Vision
    try {
      const modelInstance = getModel();

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

      const promptImagen = `
TAREA ESPECÍFICA: Analiza la imagen de este residuo/material.
${contexto ? `CONTEXTO DEL USUARIO: "${contexto}"` : ''}
${SYSTEM_PROMPT}
`;

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout de la IA')), 20000)
      );

      const generationPromise = modelInstance.generateContent([promptImagen, ...imageParts]);
      const result = await Promise.race([generationPromise, timeoutPromise]);
      const response = await result.response;
      respuesta = response.text();

    } catch (error) {
      console.warn('⚠️ Fallo Gemini Vision. Usando respuesta offline.', error.message);
      respuesta = `📸 **Análisis de imagen no disponible (Modo Offline)**\n\nNo pude conectar con el servidor de inteligencia artificial (Gemini).\n\n💡 **Sugerencia:**\nDescribe el residuo escribiendo en el chat (ej: "tengo una caja de pizza") y podré ayudarte a clasificarlo usando mi base de datos local.`;
    }

    // Guardar en historial
    const usuario = await User.findById(req.usuario.id);

    usuario.historialConsultas.push({
      pregunta: contexto || 'Análisis de imagen',
      respuesta: respuesta.trim(),
      imagen: imagen.substring(0, 50) + '...',
      fecha: new Date()
    });

    await usuario.save();

    // Responder
    res.status(200).json({
      success: true,
      mensaje: 'Imagen procesada',
      data: {
        respuesta: respuesta.trim(),
        consultaId: usuario.historialConsultas[usuario.historialConsultas.length - 1]._id,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Error en analizarImagen:', error);
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