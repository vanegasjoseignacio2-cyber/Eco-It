export default function TerminosYCondiciones() {
    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        }
    };

    // SVG Icons
    const LeafIcon = () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 8C8 10 5.9 16.17 3.82 19.33C3.3 20.1 4.08 21 4.96 20.67C7.25 19.83 11.38 18.17 14 16C18 13 19 9 17 8Z" fill="#6ee7b7" />
            <path d="M3 21C3 21 7 17 12 16" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );

    const BackIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const MapIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 20L3 17V4L9 7M9 20L15 17M9 20V7M15 17L21 20V7L15 4M15 17V4M9 7L15 4" stroke="#059669" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );

    const GameIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="20" height="12" rx="3" stroke="#059669" strokeWidth="1.5" />
            <path d="M8 12H12M10 10V14" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="16" cy="12" r="1" fill="#059669" />
            <circle cx="14" cy="10" r="1" fill="#059669" />
        </svg>
    );

    const AIIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="#059669" strokeWidth="1.5" />
            <circle cx="9" cy="9" r="2" stroke="#059669" strokeWidth="1.5" />
            <circle cx="15" cy="15" r="2" stroke="#059669" strokeWidth="1.5" />
            <path d="M9 15H15M9 9H15" stroke="#059669" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        </svg>
    );

    const XIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );

    const CheckIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const DotIcon = () => (
        <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="4" fill="#059669" />
        </svg>
    );

    const WarningIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M12 9V13M12 17H12.01" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );

    const GlobeIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="#059669" strokeWidth="1.5" />
            <path d="M12 3C12 3 9 7 9 12C9 17 12 21 12 21" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 3C12 3 15 7 15 12C15 17 12 21 12 21" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M3 12H21" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );

    const PinIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#059669" strokeWidth="1.5" />
            <circle cx="12" cy="9" r="2.5" stroke="#059669" strokeWidth="1.5" />
        </svg>
    );

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%)" }}>

            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #059669 100%)" }} className="relative overflow-hidden py-12 md:py-20">
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #34d399, transparent)", transform: "translate(30%, -30%)" }} />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #6ee7b7, transparent)", transform: "translate(-30%, 30%)" }} />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
                    {/* Back button */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 mb-6 px-4 py-2 rounded-xl text-emerald-100 font-medium text-sm transition-all duration-200"
                        style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                    >
                        <BackIcon />
                        Volver
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <LeafIcon />
                        <span className="text-emerald-300 font-semibold tracking-widest text-sm uppercase">Eco-It</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.5px" }}>
                        Términos y Condiciones
                    </h1>
                    <p className="text-emerald-200 text-sm sm:text-base">Plataforma de Gestión de Residuos — Última actualización: Abril 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-14">
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-5 sm:p-8 md:p-14 border border-emerald-100">

                    {/* Intro */}
                    <div className="mb-10 p-5 sm:p-6 rounded-2xl border-l-4" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", borderLeftColor: "#059669" }}>
                        <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                            Bienvenido a <strong className="text-emerald-700">Eco-It</strong>, una plataforma digital orientada a la gestión responsable de residuos sólidos, la educación ambiental interactiva y la geolocalización de puntos ecológicos. Al acceder y utilizar esta plataforma, usted acepta cumplir los siguientes términos y condiciones. Le recomendamos leerlos detenidamente antes de usar cualquier funcionalidad del sistema.
                        </p>
                    </div>

                    {/* 1 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#059669" }}>
                            1. INFORMACIÓN GENERAL
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                            <strong className="text-emerald-700">Eco-It</strong> es una plataforma de software de carácter educativo y ambiental, operada bajo las leyes de la República de Colombia, que busca promover hábitos sostenibles en la comunidad mediante herramientas digitales accesibles.
                        </p>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            Esta plataforma no tiene fines comerciales directos en su primera versión y está sujeta a los términos aquí descritos.
                        </p>
                    </section>

                    {/* 2 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#059669" }}>
                            2. ACEPTACIÓN DE LOS TÉRMINOS
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                            Al registrarse o utilizar cualquier servicio ofrecido en esta plataforma, usted declara que:
                        </p>
                        <ul className="space-y-3 ml-2 sm:ml-4">
                            {[
                                "Es mayor de 18 años o cuenta con la autorización de un adulto responsable para crear una cuenta.",
                                "Ha leído, entendido y acepta estos términos y condiciones en su totalidad.",
                                "Proporcionará información veraz, precisa y actualizada al momento del registro.",
                                "Usará la plataforma con fines lícitos y ambientalmente responsables.",
                            ].map((item, i) => (
                                <li key={i} className="text-gray-700 flex items-start gap-3 text-sm sm:text-base">
                                    <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#059669", minWidth: "20px" }}>{i + 1}</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* 3 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#059669" }}>
                            3. DESCRIPCIÓN DE LA PLATAFORMA Y SUS SERVICIOS
                        </h2>

                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 mt-6" style={{ color: "#065f46" }}>3.1 Módulos Disponibles</h3>
                        <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">Eco-It integra tres subsistemas principales:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                            {[
                                { icon: <MapIcon />, title: "Plataforma Web", desc: "Gestión de puntos ecológicos, perfil de actividad y mapa interactivo georeferenciado." },
                                { icon: <GameIcon />, title: "Videojuego Educativo", desc: "Juego en el navegador que promueve el reciclaje y la conciencia ambiental." },
                                { icon: <AIIcon />, title: "Módulo de IA", desc: "Clasificación experimental de residuos mediante fotografías con inteligencia artificial." },
                            ].map((m, i) => (
                                <div key={i} className="rounded-xl p-4 border" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                                    <div className="mb-2">{m.icon}</div>
                                    <h4 className="font-semibold text-emerald-800 mb-1 text-sm sm:text-base">{m.title}</h4>
                                    <p className="text-xs sm:text-sm text-gray-600">{m.desc}</p>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-lg sm:text-xl font-semibold mb-3 mt-6" style={{ color: "#065f46" }}>3.2 Exclusiones de la Primera Versión</h3>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            La versión inicial de Eco-It no contempla: aplicaciones móviles nativas, pagos en línea, integración con entidades gubernamentales externas, ni funcionalidad offline. Estas características pueden ser incorporadas en versiones futuras.
                        </p>
                    </section>

                    {/* 4 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#059669" }}>
                            4. REGISTRO Y USO DE LA CUENTA
                        </h2>

                        <h3 className="text-lg sm:text-xl font-semibold mb-3 mt-6" style={{ color: "#065f46" }}>4.1 Creación de Cuenta</h3>
                        <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">Para acceder a las funcionalidades completas de Eco-It, debe:</p>
                        <ul className="space-y-2 ml-2 sm:ml-4">
                            {[
                                "Proporcionar nombre completo, correo electrónico y una contraseña segura.",
                                "Confirmar su correo electrónico mediante el enlace de verificación enviado al registrarse.",
                                "Mantener sus credenciales de acceso de forma confidencial y segura.",
                            ].map((item, i) => (
                                <li key={i} className="text-gray-700 flex items-start gap-2 text-sm sm:text-base">
                                    <span className="mt-1 flex-shrink-0"><DotIcon /></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <h3 className="text-lg sm:text-xl font-semibold mb-3 mt-6" style={{ color: "#065f46" }}>4.2 Responsabilidad del Usuario</h3>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            El usuario es responsable de todas las actividades realizadas desde su cuenta. Eco-It no será responsable de pérdidas o daños derivados del uso no autorizado de credenciales por negligencia del titular de la cuenta.
                        </p>

                        <h3 className="text-lg sm:text-xl font-semibold mb-3 mt-6" style={{ color: "#065f46" }}>4.3 Autenticación Segura</h3>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            El sistema utiliza mecanismos de autenticación seguros con sesiones de duración limitada. Todas las comunicaciones se realizan bajo protocolo HTTPS cifrado.
                        </p>
                    </section>

                    {/* 5 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#059669" }}>
                            5. USO ACEPTABLE DE LA PLATAFORMA
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">Queda expresamente prohibido:</p>
                        <ul className="space-y-2 ml-2 sm:ml-4">
                            {[
                                "Intentar vulnerar o acceder de forma no autorizada a los servidores, bases de datos o cuentas de otros usuarios.",
                                "Publicar información falsa sobre puntos ecológicos o residuos.",
                                "Usar la plataforma para actividades ilícitas, discriminatorias o que atenten contra el medio ambiente.",
                                "Realizar ingeniería inversa, descompilar o reproducir los componentes del videojuego educativo sin autorización.",
                                "Automatizar el acceso a la plataforma mediante bots o scripts no autorizados.",
                            ].map((item, i) => (
                                <li key={i} className="text-gray-700 flex items-start gap-2 text-sm sm:text-base">
                                    <span className="flex-shrink-0 mt-1"><XIcon /></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* 6 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#059669" }}>
                            6. MÓDULO DE INTELIGENCIA ARTIFICIAL
                        </h2>
                        <div className="p-4 sm:p-5 rounded-xl border mb-4 flex items-start gap-3" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
                            <span className="flex-shrink-0 mt-0.5"><WarningIcon /></span>
                            <div>
                                <p className="text-amber-800 text-xs sm:text-sm font-semibold mb-1">Carácter Experimental</p>
                                <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
                                    El módulo de clasificación de residuos mediante IA tiene carácter experimental. Sus resultados no constituyen asesoramiento técnico oficial y no deben ser la única fuente de decisión para la gestión de residuos.
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">
                            Al usar el módulo de IA para clasificación de residuos mediante fotografías, el usuario acepta que:
                        </p>
                        <ul className="space-y-2 ml-2 sm:ml-4">
                            {[
                                "Las imágenes subidas pueden ser procesadas por servicios de terceros especializados en visión artificial.",
                                "Eco-It no garantiza la exactitud de las clasificaciones generadas por el modelo.",
                                "Las fotografías deben corresponder únicamente a residuos y no contener información personal identificable.",
                            ].map((item, i) => (
                                <li key={i} className="text-gray-700 flex items-start gap-2 text-sm sm:text-base">
                                    <span className="mt-1 flex-shrink-0"><DotIcon /></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* 7 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#059669" }}>
                            7. PROPIEDAD INTELECTUAL
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                            Todo el contenido de Eco-It, incluyendo textos, gráficos, logos, el videojuego educativo, el código fuente, modelos 3D y diseños, es propiedad de Eco-It y está protegido por las leyes colombianas e internacionales de propiedad intelectual.
                        </p>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            Queda prohibida la reproducción, distribución, modificación o uso comercial de cualquier componente de la plataforma sin autorización expresa y por escrito de Eco-It.
                        </p>
                    </section>

                    {/* 8 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#059669" }}>
                            8. DISPONIBILIDAD Y LIMITACIÓN DE RESPONSABILIDAD
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">
                            Eco-It aspira a mantener una disponibilidad adecuada del servicio, aunque no garantiza la operación ininterrumpida. Eco-It no será responsable por:
                        </p>
                        <ul className="space-y-2 ml-2 sm:ml-4">
                            {[
                                "Interrupciones del servicio por mantenimiento, actualizaciones o causas de fuerza mayor.",
                                "Pérdida de datos derivada de fallos técnicos de terceros proveedores.",
                                "Imprecisiones en la clasificación de residuos por el módulo de IA experimental.",
                                "Daños indirectos o consecuentes derivados del uso de la plataforma.",
                            ].map((item, i) => (
                                <li key={i} className="text-gray-700 flex items-start gap-2 text-sm sm:text-base">
                                    <span className="mt-1 flex-shrink-0"><DotIcon /></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* 9 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#059669" }}>
                            9. MODIFICACIONES DE LOS TÉRMINOS
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            Eco-It se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en la plataforma. Se recomienda revisar periódicamente esta página. El uso continuado de la plataforma tras la publicación de cambios implica la aceptación de los nuevos términos.
                        </p>
                    </section>

                    {/* 10 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#059669" }}>
                            10. LEY APLICABLE Y JURISDICCIÓN
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            Estos términos y condiciones se rigen por las leyes de la República de Colombia, en particular la Ley 1581 de 2012 (protección de datos personales) y la Ley 527 de 1999 (comercio electrónico y mensajes de datos). Cualquier controversia derivada de estos términos será sometida a la jurisdicción de los tribunales competentes de Colombia.
                        </p>
                    </section>

                    {/* 11 - Contacto */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#059669" }}>
                            11. INFORMACIÓN DE CONTACTO
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                            Para consultas, reclamos o solicitudes relacionadas con estos términos, puede contactar a Eco-It a través de la plataforma.
                        </p>
                        <div className="rounded-2xl p-4 sm:p-6 border" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", borderColor: "#6ee7b7" }}>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 mt-0.5"><GlobeIcon /></span>
                                    <div>
                                        <span className="font-semibold text-emerald-800 text-sm sm:text-base">Plataforma:</span>
                                        <p className="text-gray-700 text-xs sm:text-sm">Eco-It — Sistema de Gestión de Residuos con Videojuego Educativo</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 mt-0.5"><PinIcon /></span>
                                    <div>
                                        <span className="font-semibold text-emerald-800 text-sm sm:text-base">País:</span>
                                        <p className="text-gray-700 text-xs sm:text-sm">Colombia</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer notice */}
                    <div className="mt-10 p-5 sm:p-6 rounded-2xl text-center" style={{ background: "linear-gradient(135deg, #064e3b, #065f46)" }}>
                        <div className="flex justify-center mb-2">
                            <LeafIcon />
                        </div>
                        <p className="text-emerald-100 italic text-xs sm:text-sm leading-relaxed">
                            Al utilizar Eco-It, usted reconoce haber leído, comprendido y aceptado estos términos y condiciones, y se compromete a contribuir responsablemente con la gestión ambiental.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}