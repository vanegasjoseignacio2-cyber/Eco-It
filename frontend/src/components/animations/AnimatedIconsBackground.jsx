import { motion } from "framer-motion";
import { useState } from "react";
import {
    Phone,
    MessageCircle,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
} from "lucide-react";

const ICONS = [
    Phone,
    MessageCircle,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
];

// utils
const random = (min, max) => Math.random() * (max - min) + min;

function createIconConfig() {
    return {
        x: random(5, 95),          // % horizontal
        drift: random(-20, 20),    // diagonal movement
        size: random(36, 72),      // px
        duration: random(14, 26),  // seconds
        opacity: random(0.08, 0.18),
    };
}

export default function AnimatedIconsBackground() {
    const [configs, setConfigs] = useState(
        ICONS.map(() => createIconConfig())
    );

    const reshuffle = (index) => {
        setConfigs((prev) =>
            prev.map((cfg, i) => (i === index ? createIconConfig() : cfg))
        );
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {ICONS.map((Icon, index) => {
                const cfg = configs[index];

                return (
                    <motion.div
                        key={index}
                        initial={{
                            top: "-15%",
                            left: `${cfg.x}%`,
                            opacity: cfg.opacity,
                        }}
                        animate={{
                            top: "115%",
                            left: `${cfg.x + cfg.drift}%`,
                        }}
                        transition={{
                            duration: cfg.duration,
                            ease: "linear",
                        }}
                        onAnimationComplete={() => reshuffle(index)}
                        className="absolute text-green-700"
                    >
                        <Icon style={{ width: cfg.size, height: cfg.size }} />
                    </motion.div>
                );
            })}
        </div>
    );
}
