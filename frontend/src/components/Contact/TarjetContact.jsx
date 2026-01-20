import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactInfoCards() {
    const contactInfo = [
        {
            icon: Mail,
            title: "Correo Electrónico",
            value: "contacto@eco-it.com",
            description: "Responderemos en menos de 24 horas",
            color: "from-green-400 to-emerald-500",
        },
        {
            icon: Phone,
            title: "Teléfono",
            value: "+57 1 234 5678",
            description: "Lunes a Viernes, 8am - 6pm",
            color: "from-emerald-400 to-teal-500",
        },
        {
            icon: MapPin,
            title: "Ubicación",
            value: "Garzón-Huila, Colombia",
            description: "Oficinas ADAMA",
            color: "from-teal-400 to-cyan-500",
        },
        {
            icon: Clock,
            title: "Horario",
            value: "Lun - Vie: 8am - 6pm",
            description: "Horario de atención",
            color: "from-lime-400 to-green-500",
        },
    ];

    return (
        <section className="max-w-7xl py-10  mx-auto px-5 sm:px-8 lg:px-10">
            <div
                className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
            "
            >
                {contactInfo.map((info, index) => {
                    const Icon = info.icon;

                    return (
                        <motion.div
                            key={info.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className="bg-white/80  items-center rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                        >
                            <div
                                className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4 shadow-lg`}
                            >
                                <Icon className="w-7 h-7 text-white" />
                            </div>

                            <h3 className="font-semibold text-green-900 mb-1">
                                {info.title}
                            </h3>

                            <p className="text-green-700 font-medium mb-1">
                                {info.value}
                            </p>

                            <p className="text-sm font-medium text-green-600">
                                {info.description}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
