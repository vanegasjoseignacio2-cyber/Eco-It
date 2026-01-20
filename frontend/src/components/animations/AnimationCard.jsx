// import { useEffect, useRef, useState } from "react";

// export function ScrollFromSide({
//     children,
//     from = "left", // "left" | "right"
//     delay = 0,
//     className = "",
// }) {
//     const ref = useRef(null);
//     const [visible, setVisible] = useState(false);

//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             ([entry]) => {
//                 if (entry.isIntersecting) {
//                     setTimeout(() => setVisible(true), delay);
//                 } else {
//                     setVisible(false);
//                 }
//             },
//             { threshold: 0.2 }
//         );

//         if (ref.current) observer.observe(ref.current);
//         return () => observer.disconnect();
//     }, [delay]);

//     const sideClasses = {
//         left: "-translate-x-32",
//         right: "translate-x-32",
//     };

//     return (
//         <div
//             ref={ref}
//             className={`
//                 transition-all duration-700 ease-out
//                 ${visible ? "opacity-100 translate-x-0" : `opacity-0 ${sideClasses[from]}`}
//                 ${className}
//             `}
//         >
//             {children}
//         </div>
//     );
// }

