import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Leaf,
    Facebook,
    Instagram,
    Youtube,
    Mail,
    MapPin,
    Phone
} from "lucide-react";

const footerLinks = {
    navegacion: [
        { name: "Inicio", href: "/" },
        { name: "Mapas Ecológicos", href: "/maps" },
        { name: "Asistente IA", href: "/ai" },
        { name: "Juego", href: "/game" },
        { name: "Contacto", href: "/contact" },
    ],
    legal: [
        { name: "Términos y condiciones", href: "/terminosycondiciones" },
        { name: "Privacidad", href: "/politicadeprivacidad" },
    ],
};

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "Youtube" },
];

export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 text-white overflow-hidden">

            {/* Background blur */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-green-400 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">

                    {/* Brand */}
                    <div className="col-span-2 md:col-span-2 space-y-6 flex flex-col items-start text-left">
                        <Link to="/" className="flex items-center gap-2 group">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-lg group-hover:shadow-green-500/50 transition-shadow"
                            >
                                <img
                                    className="w-full h-full object-contain scale-[1.6]"
                                    src="https://res.cloudinary.com/dwx3v7vex/image/upload/v1777323332/logos/logos/Garza.png"
                                    alt="Logo de la garza"
                                />
                            </motion.div>
                            <span className="text-3xl font-bold">Eco-It</span>
                        </Link>

                        <p className="text-green-100/80 leading-relaxed max-w-sm">
                            Transformando el mundo a través de la tecnología y la conciencia
                            ecológica. Juntos podemos hacer la diferencia.
                        </p>

                        <div className="flex gap-3 justify-center md:justify-start">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 transition-colors"
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Navegación */}
                    <div className="col-span-1 text-left">
                        <h3 className="text-lg font-semibold mb-6">Navegación</h3>
                        <ul className="space-y-3">
                            {footerLinks.navegacion.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="relative text-green-100/70 hover:text-white transition-colors group pb-1 inline-block"
                                    >
                                        {link.name}
                                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="col-span-1 text-left">
                        <h3 className="text-lg font-semibold mb-6">Contacto</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-green-100/70 group cursor-pointer hover:text-white transition-colors">
                                <Mail className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5 group-hover:scale-110 group-hover:text-green-300 transition-transform duration-300" />
                                <a href="mailto:contacto@eco-it.com" className="break-all sm:break-normal">contacto@eco-it.com</a>
                            </li>
                            <li className="flex items-start gap-3 text-green-100/70 group cursor-pointer hover:text-white transition-colors">
                                <Phone className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5 group-hover:scale-110 group-hover:text-green-300 transition-transform duration-300" />
                                <a href="tel:+571234567890">+57 123 456 7890</a>
                            </li>
                            <li className="flex items-start gap-3 text-green-100/70 group cursor-pointer hover:text-white transition-colors">
                                <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5 group-hover:scale-110 group-hover:text-green-300 transition-transform duration-300" />
                                <a href="https://maps.google.com/?q=Garzón-Huila,Colombia" target="_blank" rel="noopener noreferrer">Garzón-Huila, Colombia</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                        <p className="text-green-100/60 text-sm">
                            © 2026 Eco-It. Todos los derechos reservados.
                        </p>

                        <div className="flex items-center justify-center gap-2 text-green-100/60 text-sm">
                            <span>Impulsando la sostenibilidad ambiental</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6">
                            {footerLinks.legal.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="relative text-green-100/60 text-sm hover:text-white transition-colors group pb-1"
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-green-400 transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
