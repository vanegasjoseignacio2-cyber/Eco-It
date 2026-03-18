import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import HeroSection from "../Eco-IA/HeroSection";
import EcoSidebar from "../Eco-IA/Ecosidebar";
import ChatWindow from "../Eco-IA/Chatwindow";
import ChatInput from "../Eco-IA/Charinput";
import { useAuth } from "../../context/AuthContext";
import { consultarIA, analizarImagen } from "../../services/api";

export default function AIPage() {
    const { token, estaAutenticado } = useAuth();
    
    const [messages, setMessages] = useState([
        { id: "1", type: "bot", content: "¡Hola! Soy Eco-IA, tu asistente ecológico 🌱\n\n¿Tienes alguna pregunta sobre reciclaje o gestión de residuos?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState("");

    const handleSend = async () => {
        if (!inputValue.trim() && !selectedImage) return;
        
        // Verificar autenticación
        if (!estaAutenticado) {
            setError("Debes iniciar sesión para usar el chat");
            return;
        }

        console.log('🔵 handleSend iniciado');
        console.log('Token:', token);
        console.log('Input value:', inputValue);
        console.log('Selected image:', selectedImage ? 'Sí' : 'No');

        // Crear mensaje del usuario
        const userMsg = {
            id: Date.now().toString(),
            type: "user",
            content: inputValue || "📷 Imagen enviada para análisis",
            image: selectedImage
        };

        setMessages(prev => [...prev, userMsg]);
        
        // Limpiar inputs
        const pregunta = inputValue;
        const imagen = selectedImage;
        setInputValue("");
        setSelectedImage(null);
        setError("");
        setIsTyping(true);

        try {
            let response;

            if (imagen) {
                console.log('📸 Analizando imagen...');
                console.log('Contexto:', pregunta || '(sin contexto)');
                // Analizar imagen con contexto opcional
                response = await analizarImagen(token, imagen, pregunta || "");
            } else {
                console.log('💬 Enviando pregunta:', pregunta);
                // Consulta de texto
                response = await consultarIA(token, pregunta);
            }

            console.log('✅ Respuesta recibida:', response);

            // Agregar respuesta de la IA
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    type: "bot",
                    content: response.data.respuesta
                }
            ]);

        } catch (err) {
            console.error('❌ Error al consultar IA:', err);
            
            // Mostrar error en el chat
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    type: "bot",
                    content: `❌ Error: ${err.message || 'No pude procesar tu consulta. Por favor intenta de nuevo.'}`
                }
            ]);
            
            setError(err.message || 'Error al comunicarse con la IA');
        } finally {
            setIsTyping(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            setError('Por favor selecciona una imagen válida');
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('La imagen es muy grande. Máximo 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
            setError("");
        };
        reader.onerror = () => {
            setError('Error al cargar la imagen');
        };
        reader.readAsDataURL(file);
    };

    const handleSuggestionClick = (question) => {
        setInputValue(question);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 bg-emerald-50 pt-16 md:pt-20">
                <HeroSection />

                {/* Mensaje de error global */}
                {error && (
                    <div className="max-w-6xl mx-auto px-6 mb-4">
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800 text-sm">
                            ⚠️ {error}
                        </div>
                    </div>
                )}

                {/* Advertencia si no está autenticado */}
                {!estaAutenticado && (
                    <div className="max-w-6xl mx-auto px-6 mb-4">
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-yellow-800 text-sm">
                            ℹ️ Debes <a href="/login" className="font-semibold underline">iniciar sesión</a> para usar el chat con IA
                        </div>
                    </div>
                )}

                <section className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8 p-6">
                    <EcoSidebar onQuestion={handleSuggestionClick} />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{
                            duration: 0.5,
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        whileHover={{
                            y: -5,
                            transition: { duration: 0.2 }
                        }}
                        className="lg:col-span-3 bg-gradient-to-t from-green-50 to-emerald-100 flex flex-col h-[600px] bg-card rounded-3xl border-2 border-emerald-300"
                    >
                        <ChatWindow messages={messages} isTyping={isTyping} />
                        <ChatInput
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            onSend={handleSend}
                            onImageClick={handleImageUpload}
                            selectedImage={selectedImage}
                            onImageRemove={() => setSelectedImage(null)}
                            disabled={!estaAutenticado || (!inputValue.trim() && !selectedImage)}
                        />
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}