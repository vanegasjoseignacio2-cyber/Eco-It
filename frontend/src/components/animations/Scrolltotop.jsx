import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            try {
                const el = document.querySelector(hash);
                if (el) el.scrollIntoView({ behavior: "smooth" });
            } catch (error) {
                // Ignorar errores de selectores inválidos (como tokens en el hash)
                console.warn("ScrollToTop: Selector de hash inválido ignorado");
            }
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [pathname, hash]);

    return null;
}

export default ScrollToTop;