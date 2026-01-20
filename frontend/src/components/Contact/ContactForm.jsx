import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, SendIcon, SendHorizonal } from "lucide-react";
import ViewportMotion from "../animations/ViewportMotion";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setIsSuccess(false), 5000);
        }, 1500);
    };

    return (
        <ViewportMotion direction="left">
            <div className="glass-card rounded-3xl p-8 md:p-10 shadow-xl bg-white/60 border-2 border-green-300">
                <h2 className="text-2xl flex  gap-2 items-center md:text-3xl font-bold text-green-900 mb-2">
                <SendHorizonal className="w-6 h-6 inline"/> Envíanos un mensaje 
                </h2>

                <p className="text-green-600 mb-8">
                    Completa el formulario y te responderemos lo antes posible
                </p>

                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-xl bg-green-200 border border-green-300 flex items-center gap-3"
                    >
                        <CheckCircle className="w-6 h-6 text-green-700" />
                        <div>
                            <p className="font-medium text-green-900">¡Mensaje enviado!</p>
                            <p className="text-sm text-green-700">Te responderemos pronto.</p>
                        </div>
                    </motion.div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5 ">
                    {/* Nombre y Correo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-green-800">
                                Nombre
                            </span>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Tu nombre"
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white/50"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-green-800">
                                Correo
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white/50"
                            />
                        </div>

                    </div>

                    {/* Asunto */}
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-green-800">
                            Asunto
                        </span>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white/50"
                        >
                            <option value="">Selecciona un asunto</option>
                            <option value="general">Consulta general</option>
                            <option value="support">Soporte técnico</option>
                            <option value="suggestion">Sugerencia</option>
                            <option value="partnership">Colaboración</option>
                        </select>
                    </div>

                    {/* Mensaje */}
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-green-800">
                            Mensaje
                        </span>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            placeholder="¿En qué podemos ayudarte?"
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none bg-white/50"
                        />
                    </div>

                    {/* Botón */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg flex justify-center items-center gap-2 hover:from-emerald-600 hover:to-green-500 hover:transition-all duration-500"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Enviar Mensaje
                            </>
                        )}
                    </motion.button>
                </form>


            </div>
        </ViewportMotion>
    );
}
