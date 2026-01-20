import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import HeroSection from "../Eco-IA/HeroSection";
import EcoSidebar from "../Eco-IA/Ecosidebar";
import ChatWindow from "../Eco-IA/Chatwindow";
import ChatInput from "../Eco-IA/Charinput";
import { getResponse } from "../../Utils/getResponse";

export default function AIPage() {
    const [messages, setMessages] = useState([
        { id: "1", type: "bot", content: "¡Hola! Soy tu asistente ecológico 🌱" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!inputValue.trim() && !selectedImage) return;

        const userMsg = {
            id: Date.now().toString(),
            type: "user",
            content: inputValue || "Imagen enviada",
            image: selectedImage
        };

        setMessages(prev => [...prev, userMsg]);
        const hadImage = !!selectedImage;
        setInputValue("");
        setSelectedImage(null);
        setIsTyping(true);

        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    type: "bot",
                    content: getResponse(userMsg.content, hadImage)
                }
            ]);
            setIsTyping(false);
        }, 1200);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 bg-emerald-50 pt-16 md:pt-20">
                <HeroSection />

                <section className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8 p-6">
                    <EcoSidebar onQuestion={setInputValue} />

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
                            disabled={!inputValue.trim() && !selectedImage}
                        />
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}