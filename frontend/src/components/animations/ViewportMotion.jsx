import { motion } from "framer-motion";

export default function ViewportMotion({
    children,
    delay = 0,
    direction = "up",
}) {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
            x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
        },
        exit: {
            opacity: 0,
            y: direction === "up" ? -30 : direction === "down" ? 30 : 0,
            x: direction === "left" ? -30 : direction === "right" ? 30 : 0,
        },
    };

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}
