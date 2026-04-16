export default function PoliticaDePrivacidad() {
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

    const ShieldIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V12C3 16.55 7.84 20.74 12 22C16.16 20.74 21 16.55 21 12V7L12 2Z" fill="#10b981" opacity="0.2" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 12L11 14L15 10" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const LinkIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const BuildingIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#3b82f6" strokeWidth="1.5" />
            <path d="M3 9H21M9 21V9" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );

    const GlobeIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="#10b981" strokeWidth="1.5" />
            <path d="M12 3C12 3 9 7 9 12C9 17 12 21 12 21" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 3C12 3 15 7 15 12C15 17 12 21 12 21" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M3 12H21" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );

    const ScaleIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V21M12 3L7 8M12 3L17 8" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 10L7 18H3M17 10L21 18H17" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 18H21" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );

    const WarningIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M12 9V13M12 17H12.01" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );

    const BackIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const CheckIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const DotIcon = () => (
        <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="4" fill="#10b981" />
        </svg>
    );

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%)" }}>

            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #065f46 0%, #047857 40%, #059669 70%, #10b981 100%)" }} className="relative overflow-hidden py-12 md:py-20">
                <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #34d399, transparent)", transform: "translate(-20%, -20%)" }} />
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #6ee7b7, transparent)", transform: "translate(25%, 25%)" }} />

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
                        Política de Privacidad
                    </h1>
                    <p className="text-emerald-200 text-sm sm:text-base">Protección de Datos Personales — Ley 1581 de 2012</p>
                    <p className="text-emerald-300 text-sm mt-1">Última actualización: Abril 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-14">
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-5 sm:p-8 md:p-14 border border-emerald-100">

                    {/* Intro */}
                    <div className="mb-10 p-5 sm:p-6 rounded-2xl border-l-4" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", borderLeftColor: "#10b981" }}>
                        <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                            <strong className="text-emerald-700">Eco-It</strong> se compromete a proteger la privacidad de sus usuarios y a cumplir con la <strong className="text-emerald-700">Ley 1581 de 2012</strong> y sus decretos reglamentarios sobre protección de datos personales en Colombia. Esta política explica cómo recopilamos, usamos, almacenamos y protegemos su información personal dentro de la plataforma.
                        </p>
                    </div>

                    {/* 1 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#10b981" }}>
                            1. RESPONSABLE DEL TRATAMIENTO DE DATOS
                        </h2>
                        <div className="rounded-xl p-4 sm:p-6 border" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
                            <div className="space-y-3">
                                {[
                                    { label: "Nombre del proyecto", value: "Eco-It — Plataforma de Gestión de Residuos con Videojuego Educativo" },
                                    { label: "País", value: "Colombia" },
                                    { label: "Marco normativo", value: "Ley 1581 de 2012 · Decreto 1377 de 2013 · Ley 527 de 1999" },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                                        <span className="font-semibold text-emerald-700 sm:min-w-[180px] text-sm sm:text-base">{item.label}:</span>
                                        <span className="text-gray-700 text-sm sm:text-base">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 2 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#10b981" }}>
                            2. DATOS PERSONALES QUE RECOPILAMOS
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                            Recopilamos los siguientes tipos de datos personales, de acuerdo con las finalidades del sistema:
                        </p>

                        <h3 className="text-lg sm:text-xl font-semibold mb-3 mt-6" style={{ color: "#065f46" }}>2.1 Datos de Registro y Contacto</h3>
                        <ul className="space-y-2 ml-2 sm:ml-4 mb-4">
                            {["Nombre completo", "Correo electrónico", "Contraseña (almacenada de forma segura)", "Foto de perfil (opcional)"].map((item, i) => (
                                <li key={i} className="text-gray-700 flex items-start gap-2 text-sm sm:text-base">
                                    <span className="mt-1 flex-shrink-0"><DotIcon /></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <h3 className="text-lg sm:text-xl font-semibold mb-3 mt-6" style={{ color: "#065f46" }}>2.2 Datos de Actividad Ecológica</h3>
                        <ul className="space-y-2 ml-2 sm:ml-4 mb-4">
                            {[
                                "Historial de puntos ecológicos visitados o reportados.",
                                "Imágenes de residuos subidas al módulo de clasificación.",
                                "Registro de partidas y progreso en el videojuego educativo.",
                            ].map((item, i) => (
                                <li key={i} className="text-gray-700 flex items-start gap-2 text-sm sm:text-base">
                                    <span className="mt-1 flex-shrink-0"><DotIcon /></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <h3 className="text-lg sm:text-xl font-semibold mb-3 mt-6" style={{ color: "#065f46" }}>2.3 Datos de Navegación</h3>
                        <ul className="space-y-2 ml-2 sm:ml-4">
                            {[
                                "Dirección IP y tipo de navegador.",
                                "Páginas visitadas y tiempo de permanencia en la plataforma.",
                                "Datos de sesión y autenticación.",
                                "Cookies y tecnologías similares para mejorar la experiencia.",
                            ].map((item, i) => (
                                <li key={i} className="text-gray-700 flex items-start gap-2 text-sm sm:text-base">
                                    <span className="mt-1 flex-shrink-0"><DotIcon /></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* 3 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#10b981" }}>
                            3. FINALIDAD DEL TRATAMIENTO DE DATOS
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">
                            Sus datos personales serán utilizados exclusivamente para las siguientes finalidades:
                        </p>
                        <ul className="space-y-2 ml-2 sm:ml-4">
                            {[
                                "Gestionar el registro e inicio de sesión de usuarios en la plataforma.",
                                "Personalizar el perfil de usuario y mostrar el historial de actividad ecológica.",
                                "Operar el mapa interactivo de puntos ecológicos georeferenciados.",
                                "Procesar las imágenes enviadas al módulo de clasificación de residuos.",
                                "Registrar el progreso del usuario en el videojuego educativo.",
                                "Enviar notificaciones relacionadas con la cuenta (verificación, recuperación de contraseña).",
                                "Realizar análisis estadísticos de uso de la plataforma en forma anonimizada.",
                                "Mejorar continuamente las funcionalidades de Eco-It.",
                            ].map((item, i) => (
                                <li key={i} className="text-gray-700 flex items-start gap-2 text-sm sm:text-base">
                                    <span className="mt-1 flex-shrink-0"><DotIcon /></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* 4 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#10b981" }}>
                            4. BASE LEGAL DEL TRATAMIENTO
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                            El tratamiento de sus datos personales se realiza bajo los siguientes fundamentos legales contemplados en la Ley 1581 de 2012:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {[
                                { title: "Consentimiento", desc: "Otorgado al registrarse y aceptar esta política de privacidad." },
                                { title: "Ejecución del servicio", desc: "Necesario para proveer las funcionalidades de la plataforma." },
                                { title: "Interés legítimo", desc: "Mejora del servicio y análisis estadístico anonimizado." },
                                { title: "Obligación legal", desc: "Cumplimiento de obligaciones establecidas por la ley colombiana." },
                            ].map((item, i) => (
                                <div key={i} className="rounded-xl p-4 border" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckIcon />
                                        <h4 className="font-semibold text-emerald-700 text-sm sm:text-base">{item.title}</h4>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600 ml-6">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 5 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#10b981" }}>
                            5. TRANSFERENCIA DE DATOS A TERCEROS
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                            Eco-It puede hacer uso de servicios externos de confianza que procesan datos del usuario de forma limitada y con fines específicos. Dichos proveedores actúan bajo acuerdos de confidencialidad y cumplen con las normativas de protección de datos aplicables.
                        </p>
                        <div className="space-y-3">
                            {[
                                { name: "Almacenamiento de imágenes", purpose: "Gestión y entrega de imágenes de perfil y residuos mediante servicios CDN." },
                                { name: "Clasificación por inteligencia artificial", purpose: "Procesamiento experimental de imágenes de residuos para su clasificación." },
                                { name: "Alojamiento del servicio", purpose: "Infraestructura de servidores que soporta el funcionamiento de la plataforma." },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 sm:gap-4 p-4 rounded-xl border" style={{ borderColor: "#d1fae5", background: "#f8fffe" }}>
                                    <span className="flex-shrink-0 mt-0.5"><LinkIcon /></span>
                                    <div>
                                        <p className="font-semibold text-emerald-800 text-sm sm:text-base">{item.name}</p>
                                        <p className="text-xs sm:text-sm text-gray-600">{item.purpose}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed mt-4 text-xs sm:text-sm">
                            No vendemos, alquilamos ni compartimos datos personales con terceros con fines comerciales o publicitarios.
                        </p>
                    </section>

                    {/* 6 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#10b981" }}>
                            6. SEGURIDAD DE LOS DATOS
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">
                            Eco-It implementa medidas técnicas y organizativas para proteger su información contra accesos no autorizados, pérdida o alteración, incluyendo:
                        </p>
                        <ul className="space-y-2 ml-2 sm:ml-4">
                            {[
                                "Comunicaciones cifradas bajo protocolo HTTPS en toda la plataforma.",
                                "Autenticación segura mediante tokens con expiración.",
                                "Contraseñas almacenadas mediante algoritmos de cifrado seguros.",
                                "Acceso restringido a la base de datos desde el servidor de la plataforma.",
                                "Control de acceso por roles en el panel de administración.",
                            ].map((item, i) => (
                                <li key={i} className="text-gray-700 flex items-start gap-2 text-sm sm:text-base">
                                    <span className="flex-shrink-0 mt-0.5"><ShieldIcon /></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* 7 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#10b981" }}>
                            7. TIEMPO DE CONSERVACIÓN DE LOS DATOS
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                            Conservaremos sus datos personales durante el tiempo necesario para cumplir con las finalidades descritas en esta política o mientras mantenga una cuenta activa en Eco-It.
                        </p>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            Los datos relacionados con actividad en la plataforma se conservarán por un máximo de <strong className="text-emerald-700">cinco (5) años</strong> o hasta que el usuario solicite su eliminación, conforme a lo exigido por la normativa colombiana aplicable.
                        </p>
                    </section>

                    {/* 8 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#10b981" }}>
                            8. SUS DERECHOS COMO TITULAR DE DATOS
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                            De conformidad con la <strong className="text-emerald-700">Ley 1581 de 2012</strong>, usted tiene los siguientes derechos sobre sus datos personales:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {[
                                { right: "Acceso", desc: "Conocer qué datos personales suyos están siendo tratados." },
                                { right: "Actualización", desc: "Solicitar la corrección de datos incorrectos o desactualizados." },
                                { right: "Rectificación", desc: "Corregir datos inexactos o incompletos en su perfil." },
                                { right: "Supresión", desc: "Solicitar la eliminación de sus datos cuando sea procedente." },
                                { right: "Revocación", desc: "Revocar la autorización otorgada para el tratamiento de sus datos." },
                                { right: "Portabilidad", desc: "Solicitar una copia de sus datos personales en formato electrónico." },
                            ].map((item, i) => (
                                <div key={i} className="rounded-xl p-4 border" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckIcon />
                                        <h4 className="font-semibold text-emerald-700 text-sm sm:text-base">{item.right}</h4>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600 ml-6">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 p-4 sm:p-5 rounded-xl border text-sm sm:text-base" style={{ background: "#ecfdf5", borderColor: "#6ee7b7" }}>
                            <p className="text-gray-700 leading-relaxed">
                                Para ejercer cualquiera de estos derechos, puede contactar directamente a Eco-It. Atenderemos su solicitud dentro de los <strong className="text-emerald-700">quince (15) días hábiles</strong> siguientes a su recepción, conforme al artículo 14 de la Ley 1581 de 2012.
                            </p>
                        </div>
                    </section>

                    {/* 9 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#10b981" }}>
                            9. COOKIES Y TECNOLOGÍAS SIMILARES
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">
                            Eco-It utiliza cookies y tecnologías de almacenamiento local para:
                        </p>
                        <ul className="space-y-2 ml-2 sm:ml-4">
                            {[
                                "Mantener la sesión activa del usuario mediante tokens de autenticación.",
                                "Recordar preferencias de configuración de la plataforma.",
                                "Analizar el comportamiento de navegación de forma anonimizada para mejoras del servicio.",
                            ].map((item, i) => (
                                <li key={i} className="text-gray-700 flex items-start gap-2 text-sm sm:text-base">
                                    <span className="mt-1 flex-shrink-0"><DotIcon /></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4 text-xs sm:text-sm">
                            Puede configurar su navegador para rechazar cookies, aunque esto puede afectar el funcionamiento de algunas funcionalidades de la plataforma.
                        </p>
                    </section>

                    {/* 10 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#10b981" }}>
                            10. PROTECCIÓN DE MENORES DE EDAD
                        </h2>
                        <div className="rounded-xl p-4 sm:p-6 border flex items-start gap-3" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
                            <span className="flex-shrink-0 mt-0.5"><WarningIcon /></span>
                            <p className="text-amber-800 leading-relaxed text-sm sm:text-base">
                                Eco-It no está dirigido a menores de 18 años. No recopilamos intencionalmente datos personales de menores sin el consentimiento previo y verificable de sus padres o tutores legales. Si tiene conocimiento de que un menor ha proporcionado datos personales sin autorización, le rogamos contactarnos para proceder a su eliminación inmediata.
                            </p>
                        </div>
                    </section>

                    {/* 11 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#10b981" }}>
                            11. AUTORIDAD DE CONTROL
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                            Si considera que sus derechos han sido vulnerados, puede presentar una queja ante la Superintendencia de Industria y Comercio (SIC), autoridad competente en materia de protección de datos personales en Colombia.
                        </p>
                        <div className="rounded-xl p-4 sm:p-6 border" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                            <div className="flex items-center gap-2 mb-2">
                                <BuildingIcon />
                                <p className="font-semibold text-blue-700 text-sm sm:text-base">Superintendencia de Industria y Comercio</p>
                            </div>
                            <p className="text-gray-700 text-xs sm:text-sm mb-1 ml-7"><strong>Sitio web:</strong> www.sic.gov.co</p>
                            <p className="text-gray-700 text-xs sm:text-sm ml-7"><strong>Línea gratuita nacional:</strong> 01 8000 910 165</p>
                        </div>
                    </section>

                    {/* 12 */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#10b981" }}>
                            12. MODIFICACIONES A ESTA POLÍTICA
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            Eco-It se reserva el derecho de actualizar esta política de privacidad en cualquier momento. Las modificaciones serán publicadas en la plataforma con indicación de la fecha de actualización. Le recomendamos revisarla periódicamente. El uso continuado de la plataforma tras la publicación de cambios implica la aceptación de la política actualizada.
                        </p>
                    </section>

                    {/* 13 - Contacto */}
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: "#10b981" }}>
                            13. CONTACTO
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                            Para consultas, solicitudes o reclamos relacionados con el tratamiento de sus datos personales:
                        </p>
                        <div className="rounded-2xl p-4 sm:p-6 border" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", borderColor: "#6ee7b7" }}>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 mt-0.5"><GlobeIcon /></span>
                                    <div>
                                        <p className="font-semibold text-emerald-800 text-sm sm:text-base">Plataforma</p>
                                        <p className="text-gray-700 text-xs sm:text-sm">Eco-It — Sistema de Gestión de Residuos con Videojuego Educativo</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 mt-0.5"><ScaleIcon /></span>
                                    <div>
                                        <p className="font-semibold text-emerald-800 text-sm sm:text-base">Marco Legal</p>
                                        <p className="text-gray-700 text-xs sm:text-sm">Ley 1581 de 2012 · Decreto 1377 de 2013 · Colombia</p>
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
                            Al utilizar Eco-It, usted reconoce que ha leído y comprendido esta Política de Privacidad, y consiente el tratamiento de sus datos personales conforme a lo aquí establecido y a la normativa colombiana vigente.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}