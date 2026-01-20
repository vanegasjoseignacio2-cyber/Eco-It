import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const socials = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export default function SocialLinks() {
    return (
        <div className="bg-white/70 rounded-2xl p-6">
            <h3 className="font-semibold text-green-900 mb-4">
                Síguenos en redes
            </h3>

            <div className="flex gap-4">
                {socials.map((social) => {
                    const Icon = social.icon;

                    return (
                        <motion.a
                            key={social.label}
                            href={social.href}
                            aria-label={social.label}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="
                w-12 h-12
                rounded-xl
                bg-gradient-to-br from-green-400 to-emerald-500
                flex items-center justify-center
                text-white
                shadow-lg
                hover:shadow-xl
                transition-shadow
              "
                        >
                            <Icon className="w-5 h-5" />
                        </motion.a>
                    );
                })}
            </div>
        </div>
    );
}
