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
    recursos: [
        { name: "Guía de Reciclaje", href: "#" },
        { name: "Tips Ecológicos", href: "#" },
        { name: "Puntos de Acopio", href: "#" },
        { name: "Blog", href: "#" },
    ],
    legal: [
        { name: "Términos de Uso", href: "#" },
        { name: "Privacidad", href: "#" },
        { name: "Cookies", href: "#" },
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center"
                            >
                                <Leaf className="w-7 h-7 text-white" />
                            </motion.div>
                            <span className="text-3xl font-bold">Eco-It</span>
                        </Link>

                        <p className="text-green-100/80 leading-relaxed">
                            Transformando el mundo a través de la tecnología y la conciencia
                            ecológica. Juntos podemos hacer la diferencia.
                        </p>

                        <div className="flex gap-3">
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
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Navegación</h3>
                        <ul className="space-y-3">
                            {footerLinks.navegacion.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-green-100/70 hover:text-white transition-colors hover:translate-x-1 inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Recursos */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Recursos</h3>
                        <ul className="space-y-3">
                            {footerLinks.recursos.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-green-100/70 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Contacto</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-green-100/70">
                                <Mail className="w-5 h-5 text-green-400" />
                                <span>contacto@eco-it.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-green-100/70">
                                <Phone className="w-5 h-5 text-green-400" />
                                <span>+57 123 456 7890</span>
                            </li>
                            <li className="flex items-start gap-3 text-green-100/70">
                                <MapPin className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span>Garzón-Huila, Colombia</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-green-100/60 text-sm">
                            © 2026 Eco-It. Todos los derechos reservados.
                        </p>

                        <div className="flex items-center gap-2 text-green-100/60 text-sm">
                            <span>Impulsando la sostenibilidad ambiental</span>
                        </div>

                        <div className="flex gap-6">
                            {footerLinks.legal.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-green-100/60 text-sm hover:text-white transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
