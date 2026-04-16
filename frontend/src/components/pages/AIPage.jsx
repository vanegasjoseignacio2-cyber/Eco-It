import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import HeroSection from "../Eco-IA/HeroSection";
import EcoSidebar from "../Eco-IA/Ecosidebar";
import ChatWindow from "../Eco-IA/Chatwindow";
import ChatInput from "../Eco-IA/Charinput";
import ChatHeader from "../Eco-IA/Chatheader";
import SuggestedQuestions from "../Eco-IA/Suggestedquestions";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { consultarIA, analizarImagen, obtenerChats, obtenerChat, eliminarChat, eliminarTodosLosChats } from "../../services/api";
import { AlertTriangle, Info, X, Menu, ChevronLeft, Cpu, CircuitBoard, Layers, Bot, Zap, Leaf, Brain, Sparkles, Recycle, Sprout, Trash2, Droplets, Square } from "lucide-react";
import ConfirmationModal from "../ui/ConfirmationModal";
import EcoFacts from "../Eco-IA/EcoFacts";

export default function AIPage() {
    const { token, estaAutenticado } = useAuth();
    const { showToast } = useToast();

    const initialMessage = {
        id: "1",
        type: "bot",
        content: "¡Hola! Soy Eco-IA, tu asistente ecológico 🌱\n\n¿Tienes alguna pregunta sobre reciclaje o gestión de residuos?"
    };

    const [messages, setMessages] = useState([initialMessage]);
    const [inputValue, setInputValue] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Estados para confirmación de eliminación
    const [chatIdToDelete, setChatIdToDelete] = useState(null);
    const [isDeletingAll, setIsDeletingAll] = useState(false);

    // Referencia para cancelar petición actual
    const abortControllerRef = useRef(null);

    const loadChats = async () => {
        if (!estaAutenticado || !token) return;
        try {
            const data = await obtenerChats(token);
            setChats(data);
        } catch (err) {
            console.error("Error al cargar historial:", err);
        }
    };

    useEffect(() => {
        if (estaAutenticado) {
            loadChats();
        } else {
            setChats([]);
            setActiveChatId(null);
            setMessages([initialMessage]);
        }
    }, [estaAutenticado, token]);

    const handleNewChat = () => {
        setActiveChatId(null);
        setMessages([initialMessage]);
        setInputValue("");
        setSelectedImage(null);
        setSidebarOpen(false);
    };

    const handleSelectChat = async (chatId) => {
        if (!estaAutenticado) return;
        try {
            const chatData = await obtenerChat(token, chatId);
            setActiveChatId(chatId);
            const mappedMessages = chatData.mensajes.map(m => ({
                id: m._id || Date.now().toString() + Math.random(),
                type: m.role,
                content: m.content,
                image: m.imagen || null
            }));
            setMessages(mappedMessages);
            setSidebarOpen(false);
        } catch {
            showToast("No se pudo cargar la conversación.", "error");
        }
    };

    const handleDeleteChat = (chatId) => {
        setChatIdToDelete(chatId);
    };

    const confirmDeleteChat = async () => {
        if (!chatIdToDelete) return;
        try {
            await eliminarChat(token, chatIdToDelete);
            if (activeChatId === chatIdToDelete) handleNewChat();
            await loadChats();
            showToast("Chat eliminado correctamente", "success");
        } catch {
            showToast("No se pudo eliminar el chat", "error");
        } finally {
            setChatIdToDelete(null);
        }
    };

    const handleDeleteAllChats = () => {
        setIsDeletingAll(true);
    };

    const confirmDeleteAllChats = async () => {
        try {
            await eliminarTodosLosChats(token);
            handleNewChat();
            await loadChats();
            showToast("Tu historial ha sido limpiado", "success");
        } catch {
            showToast("Error al eliminar el historial", "error");
        } finally {
            setIsDeletingAll(false);
        }
    };

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    };

    const handleSend = async (optionalText = null) => {
        const query = optionalText || inputValue;
        if (!query.trim() && !selectedImage) return;
        if (!estaAutenticado) {
            showToast("Debes iniciar sesión para usar el chat", "warning");
            return;
        }

        const userMsg = {
            id: Date.now().toString(),
            type: "user",
            content: query || "📷 Imagen enviada para análisis",
            image: selectedImage
        };

        if (messages.length === 1 && messages[0].id === "1" && !activeChatId) {
            setMessages([userMsg]);
        } else {
            setMessages(prev => [...prev, userMsg]);
        }

        const pregunta = query;
        const imagen = selectedImage;
        setInputValue("");
        setSelectedImage(null);
        setIsTyping(true);

        const botMsgId = Date.now().toString() + "_bot";
        setMessages(prev => [...prev, { id: botMsgId, type: "bot", content: "" }]);

        // Crear nuevo AbortController para esta petición
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            if (imagen) {
                const response = await analizarImagen(token, imagen, pregunta || "", activeChatId, controller.signal);
                setMessages(prev => prev.map(msg =>
                    msg.id === botMsgId ? { ...msg, content: response.data.respuesta } : msg
                ));
                if (response.data.chatId && !activeChatId) {
                    setActiveChatId(response.data.chatId);
                    await loadChats();
                }
            } else {
                let firstChatIdReceived = activeChatId;
                await consultarIA(token, pregunta, activeChatId, (chunkContent, chunkChatId) => {
                    if (chunkChatId && !firstChatIdReceived) {
                        firstChatIdReceived = chunkChatId;
                        setActiveChatId(chunkChatId);
                        loadChats();
                    }
                    if (chunkContent) {
                        setMessages(prev => prev.map(msg =>
                            msg.id === botMsgId ? { ...msg, content: msg.content + chunkContent } : msg
                        ));
                    }
                }, controller.signal);
                if (!activeChatId) await loadChats();
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('Petición cancelada por el usuario');
                // No mostramos error, simplemente dejamos el mensaje como está
            } else {
                setMessages(prev => prev.map(msg =>
                    msg.id === botMsgId ? { ...msg, content: `❌ Error: ${err.message || 'No pude procesar tu consulta.'}` } : msg
                ));
            }
        } finally {
            setIsTyping(false);
            abortControllerRef.current = null;
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { 
            showToast('Por favor selecciona una imagen válida', 'error'); 
            return; 
        }
        if (file.size > 5 * 1024 * 1024) { 
            showToast('La imagen es muy grande. Máximo 5MB', 'error'); 
            return; 
        }
        const reader = new FileReader();
        reader.onloadend = () => { setSelectedImage(reader.result); };
        reader.onerror = () => console.error('Error al cargar la imagen');
        reader.readAsDataURL(file);
    };

    const handleSuggestionClick = (question) => {
        if (isTyping) return;
        handleSend(question);
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#fafafa]">
            <Navbar />

            {/* FONDO ANIMADO PREMIUM - Íconos de IA y Reciclaje subiendo */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div 
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(circle at 0% 100%, #bcf2d9 0%, #ecfdf5 30%, #ffffff 100%)"
                    }}
                />
                
                <AnimatePresence>
                    {[...Array(15)].map((_, i) => {
                        const Icons = [
                            Bot, Cpu, CircuitBoard, Zap, Brain, Sparkles, // IA
                            Leaf, Recycle, Sprout, Trash2, Droplets      // Reciclaje
                        ];
                        const Icon = Icons[i % Icons.length];
                        
                        // Configuración aleatoria para cada ícono
                        const size = 12 + (i * 6);
                        const duration = 25 + (i * 5);
                        const delay = i * 2;
                        const initialX = (i * 7);
                        
                        return (
                            <motion.div
                                key={i}
                                className="absolute text-emerald-600/15"
                                initial={{ 
                                    y: "110vh", 
                                    x: `${initialX}vw`, 
                                    rotate: 0,
                                    opacity: 0,
                                    scale: 0.5
                                }}
                                animate={{ 
                                    y: "-20vh", 
                                    rotate: 360,
                                    opacity: [0, 1, 1, 0],
                                    scale: 1
                                }}
                                transition={{
                                    duration: duration,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: delay,
                                }}
                            >
                                <Icon size={size} strokeWidth={0.8} />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <main className="flex-1 pt-12 md:pt-16 relative z-10">
                <HeroSection />

                {/* Layout principal — Tres columnas en Desktop */}
                <section id="chat-section" className="max-w-[1600px] mx-auto px-4 sm:px-8 py-10 lg:py-20">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

                        {/* COLUMNA 1: SIDEBAR (Historial y Datos) */}
                        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                            {/* Botón sidebar mobile */}
                            <div className="flex items-center gap-3 mb-6 lg:hidden">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSidebarOpen(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs bg-white shadow-sm border border-emerald-100 text-[#064e3b] uppercase tracking-widest"
                                >
                                    <Menu size={14} />
                                    Conversaciones
                                </motion.button>
                            </div>

                            <div className="hidden lg:block h-[700px]">
                                <EcoSidebar
                                    onQuestion={handleSuggestionClick}
                                    chats={chats}
                                    activeChatId={activeChatId}
                                    onSelectChat={handleSelectChat}
                                    onNewChat={handleNewChat}
                                    onDeleteChat={handleDeleteChat}
                                    onDeleteAllChats={handleDeleteAllChats}
                                />
                            </div>
                        </div>

                        {/* COLUMNA 2: CHAT PRINCIPAL */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 w-full min-w-0"
                        >
                            <div
                                className="flex flex-col overflow-hidden relative"
                                style={{
                                    height: "700px",
                                    background: "rgba(255,255,255,0.92)",
                                    backdropFilter: "blur(40px) saturate(150%)",
                                    borderRadius: "32px",
                                    border: "1px solid rgba(16,185,129,0.15)",
                                    boxShadow: "0 40px 100px -20px rgba(6,78,59,0.12)",
                                }}
                            >
                                <ChatHeader />
                                <div className="flex-1 overflow-hidden flex flex-col relative">
                                    <ChatWindow messages={messages} isTyping={isTyping} />
                                </div>
                                <ChatInput
                                    inputValue={inputValue}
                                    setInputValue={setInputValue}
                                    onSend={handleSend}
                                    onStop={handleStop}
                                    onImageClick={handleImageUpload}
                                    selectedImage={selectedImage}
                                    onImageRemove={() => setSelectedImage(null)}
                                    isTyping={isTyping}
                                    disabled={!estaAutenticado}
                                />
                            </div>
                        </motion.div>

                        {/* COLUMNA 3: PREGUNTAS SUGERIDAS (Desktop Only Side) */}
                        <div className="hidden xl:block w-72 flex-shrink-0">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="sticky top-32"
                            >
                                <div className="mb-4 ml-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#064e3b]/30">Sugerencias</h4>
                                </div>
                                <SuggestedQuestions onSelect={handleSuggestionClick} />
                                
                                <div className="mt-8">
                                    <EcoFacts />
                                </div>
                            </motion.div>
                        </div>

                        <div className="xl:hidden w-full order-last mt-4 space-y-4">
                            <SuggestedQuestions onSelect={handleSuggestionClick} />
                            <EcoFacts />
                        </div>
                    </div>
                </section>

                {/* SIDEBAR MOBILE OVERLAY */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSidebarOpen(false)}
                                className="fixed inset-0 z-[60] bg-emerald-950/20 backdrop-blur-md lg:hidden"
                            />
                            <motion.div
                                initial={{ x: -400 }}
                                animate={{ x: 0 }}
                                exit={{ x: -400 }}
                                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                                className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm z-[70] p-6 pt-24 bg-white/95 backdrop-blur-3xl lg:hidden shadow-3xl"
                            >
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="absolute top-8 right-6 p-2 rounded-full bg-emerald-50 text-emerald-900"
                                >
                                    <X size={20} />
                                </button>
                                <EcoSidebar
                                    onQuestion={handleSuggestionClick}
                                    chats={chats}
                                    activeChatId={activeChatId}
                                    onSelectChat={handleSelectChat}
                                    onNewChat={handleNewChat}
                                    onDeleteChat={handleDeleteChat}
                                    onDeleteAllChats={handleDeleteAllChats}
                                />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </main>

            <Footer />

            {/* Modales de Confirmación */}
            <ConfirmationModal
                isOpen={!!chatIdToDelete}
                onClose={() => setChatIdToDelete(null)}
                onConfirm={confirmDeleteChat}
                title="¿Eliminar conversación?"
                message="Esta conversación se borrará permanentemente de tu historial."
                confirmText="Eliminar"
                type="danger"
            />

            <ConfirmationModal
                isOpen={isDeletingAll}
                onClose={() => setIsDeletingAll(false)}
                onConfirm={confirmDeleteAllChats}
                title="¿Borrar todo el historial?"
                message="Esta acción eliminará todas tus conversaciones guardadas. No se puede deshacer."
                confirmText="Borrar todo"
                type="danger"
            />
        </div>
    );
}