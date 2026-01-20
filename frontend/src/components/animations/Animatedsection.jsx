import { useEffect, useRef, useState } from "react";

export default function AnimatedSection({
    children,
    delay = 0,
    className = "",
}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    timeoutRef.current = setTimeout(() => {
                        setVisible(true);
                    }, delay);
                } else {
                    setVisible(false);
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                }
            },
            {
                threshold: 0.25,
            }
        );

        if (ref.current) observer.observe(ref.current);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            observer.disconnect();
        };
    }, [delay]);

    return (
        <div
            ref={ref}
            className={`
        transform transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
        ${className}
    `}
        >
            {children}
        </div>
    );
}
