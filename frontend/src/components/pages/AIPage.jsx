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
        if (!estaAutenticado) {
            setError("Debes iniciar sesión para usar el chat");
            return;
        }

        const userMsg = {
            id: Date.now().toString(),
            type: "user",
            content: inputValue || "📷 Imagen enviada para análisis",
            image: selectedImage
        };

        setMessages(prev => [...prev, userMsg]);

        const pregunta = inputValue;
        const imagen = selectedImage;
        setInputValue("");
        setSelectedImage(null);
        setError("");
        setIsTyping(true);

        // Crear mensaje del bot vacío que se irá llenando
        const botMsgId = Date.now().toString() + "_bot";
        setMessages(prev => [...prev, { id: botMsgId, type: "bot", content: "" }]);

        try {
            if (imagen) {
                const response = await analizarImagen(token, imagen, pregunta || "");
                setMessages(prev => prev.map(msg =>
                    msg.id === botMsgId
                        ? { ...msg, content: response.data.respuesta }
                        : msg
                ));
            } else {
                // Cada chunk actualiza el mensaje del bot en tiempo real
                await consultarIA(token, pregunta, (chunk) => {
                    setMessages(prev => prev.map(msg =>
                        msg.id === botMsgId
                            ? { ...msg, content: msg.content + chunk }
                            : msg
                    ));
                });
            }
        } catch (err) {
            console.error('❌ Error al consultar IA:', err);
            setMessages(prev => prev.map(msg =>
                msg.id === botMsgId
                    ? { ...msg, content: `❌ Error: ${err.message || 'No pude procesar tu consulta.'}` }
                    : msg
            ));
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