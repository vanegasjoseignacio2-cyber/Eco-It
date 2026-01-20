import { motion } from "framer-motion";

/* =========================
    CONTENEDORES DE ENTRADA
========================= */

export const FadeInLeft = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

export const FadeInRight = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

export const FadeInUp = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

/* =========================
   SCALE / ICONOS
========================= */

export const ScaleIn = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
            type: "spring",
            stiffness: 120,
            damping: 12,
            delay,
        }}
    >
        {children}
    </motion.div>
);

/* =========================
   BOTONES
========================= */

export const ButtonMotion = ({ children, disabled }) => (
    <motion.button
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.97 } : {}}
        disabled={disabled}
    >
        {children}
    </motion.button>
);

/* =========================
   SPINNER (LOADING)
========================= */

export const Spinner = () => (
    <motion.div
        animate={{ rotate: 360 }}
        transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
        }}
        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
    />
);

/* =========================
   LIST ITEM (CHECK)
========================= */

export const ListItemMotion = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);
