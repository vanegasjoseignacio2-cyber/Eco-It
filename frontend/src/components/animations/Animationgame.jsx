const animations = {
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
    },
    fadeInLeft: {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
    },
    fadeInRight: {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
    },
    scaleIn: {
        initial: { scale: 0 },
        animate: { scale: 1 },
    },
    hoverLift: {
        whileHover: { y: -8, scale: 1.02 },
    },
    buttonHover: {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
    },
};

export default animations;