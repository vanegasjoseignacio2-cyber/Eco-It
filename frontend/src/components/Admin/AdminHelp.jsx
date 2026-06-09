import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Gamepad2,
    BarChart3,
    Map,
    ImagePlus,
    Bell,
    ShieldAlert,
    ChevronDown,
    BookOpen,
    HelpCircle,
    Maximize2,
    X,
    ZoomIn,
    Plus,
    Minus,
    RefreshCw
} from "lucide-react";

const ManualImage = ({ src, alt, onOpen }) => (
    <div 
        className="rounded-xl border border-green-100 bg-white p-2 shadow-sm cursor-zoom-in group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-green-200"
        onClick={() => onOpen(src)}
    >
        <div className="relative overflow-hidden rounded-lg bg-green-50/30">
            <img 
                src={src} 
                alt={alt} 
                className="w-full h-auto rounded-lg opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500" 
            />
            
            {/* Corner Expand Button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-lg shadow-lg border border-green-100 flex items-center justify-center">
                    <Maximize2 className="w-3.5 h-3.5 text-green-600" />
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    </div>
);

const getManualSections = (onImageClick) => [
    {
        id: "dashboard",
        title: "Dashboard",
        tag: "Resumen General",
        icon: LayoutDashboard,
        color: "text-emerald-500",
        bgColor: "bg-emerald-100",
        content: (
            <div className="space-y-6 text-sm text-green-800">
                <p>Esta es la pantalla de inicio. Te sirve para ver rápidamente cómo va la página hoy.</p>
                <ul className="list-disc pl-5 space-y-6">
                    <li>
                        <strong>¿Cómo ver los números importantes?</strong><br/>
                        Solo tienes que mirar las tarjetas o cuadros grandes en la parte de arriba de la pantalla. Allí verás cuántas personas hay registradas en total, cuántas están usando la página en este preciso momento, y cuántas consultas han hecho al asistente. Los números cambian solos en tiempo real.
                        <div className="mt-4 flex flex-col gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.58 PM.jpeg" 
                                alt="Ver tarjetas numericas" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                    <li>
                        <strong>¿Cómo ver los últimos movimientos?</strong><br/>
                        Desliza la página un poco hacia abajo. Encontrarás una lista que se llama "Actividad Reciente". Ahí puedes leer paso a paso las cosas que van haciendo las personas en la página (como cuando alguien entra o se gana puntos).
                        <div className="mt-4 flex flex-col gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.58 PM (1).jpeg" 
                                alt="Actividad reciente" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "users",
        title: "Usuarios",
        tag: "Control de Personas",
        icon: Users,
        color: "text-blue-500",
        bgColor: "bg-blue-100",
        content: (
            <div className="space-y-6 text-sm text-green-800">
                <p>Aquí puedes ver la lista de todas las personas que tienen una cuenta en nuestra página y controlarlas.</p>
                <ul className="list-disc pl-5 space-y-6">
                    <li>
                        <strong>¿Cómo buscar a alguien?</strong><br/>
                        Ve a la parte superior de la pantalla y escribe el nombre o el correo de la persona en la caja que tiene un ícono de lupa. Espera un segundo y la persona aparecerá en la lista de abajo.
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.58 PM (2).jpeg" 
                                alt="Buscar usuario 1" 
                                onOpen={onImageClick} 
                            />
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.58 PM (3).jpeg" 
                                alt="Buscar usuario 2" 
                                onOpen={onImageClick} 
                            />
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.58 PM (4).jpeg" 
                                alt="Buscar usuario 3" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                    <li>
                        <strong>¿Cómo darle permisos a alguien para que te ayude?</strong><br/>
                        Busca a la persona en la lista. A la derecha de su nombre verás un botón con tres puntitos. Haz clic ahí, luego selecciona "Cambiar a Admin" y confirma. Ahora esa persona podrá ver este panel.
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.58 PM (5).jpeg" 
                                alt="Cambiar a admin 1" 
                                onOpen={onImageClick} 
                            />
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.58 PM (6).jpeg" 
                                alt="Cambiar a admin 2" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                    <li>
                        <strong>¿Cómo suspender a alguien que se portó mal?</strong><br/>
                        En el mismo botón de tres puntitos junto a su nombre, haz clic en "Bloquear". Aparecerá una ventana preguntándote por cuántos días quieres suspenderlo. Escribe el número y haz clic en confirmar. Esa persona no podrá entrar durante ese tiempo.
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.58 PM (7).jpeg" 
                                alt="Bloquear usuario" 
                                onOpen={onImageClick} 
                            />
                            <ManualImage 
                                src="/Manual de usuario/seleccionar días de ban.jpeg" 
                                alt="Seleccionar días" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                    <li>
                        <strong>¿Cómo eliminar una cuenta?</strong><br/>
                        Junto al nombre de la persona, haz clic en el botón de la papelera (basurero) que aparece al final del menú de tres puntos. El sistema te preguntará si estás seguro. Si le dices que sí, la cuenta se borrará para siempre.
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ManualImage 
                                src="/Manual de usuario/eloiminar1.jpeg" 
                                alt="Eliminar cuenta 1" 
                                onOpen={onImageClick} 
                            />
                            <ManualImage 
                                src="/Manual de usuario/eliminar.jpeg" 
                                alt="Eliminar cuenta 2" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "stats",
        title: "Estadísticas",
        tag: "Crecimiento y Visitas",
        icon: BarChart3,
        color: "text-purple-500",
        bgColor: "bg-purple-100",
        content: (
            <div className="space-y-6 text-sm text-green-800">
                <p>Este apartado te muestra con dibujos y gráficas si la página está creciendo y cómo se comporta la gente con el tiempo.</p>
                <ul className="list-disc pl-5 space-y-6">
                    <li>
                        <strong>¿Cómo ver si la página está creciendo?</strong><br/>
                        Al entrar a esta sección, verás inmediatamente unos dibujos de líneas (gráficas). Si las líneas van hacia arriba, significa que más personas están usando la página o haciendo preguntas ese día.
                        <div className="mt-4 flex flex-col gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.58 PM (8).jpeg" 
                                alt="Grafica crecimiento" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                    <li>
                        <strong>¿Cómo ver el resumen de otro mes u otro año?</strong><br/>
                        En la parte de arriba de las gráficas verás unos botones pequeños que dicen "Semana", "Mes" o "Año". Haz clic en el que quieras. Si haces clic en "Mes", el dibujo cambiará por sí solo para mostrarte los datos de los últimos 30 días.
                        <div className="mt-4 flex flex-col gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.58 PM (9).jpeg" 
                                alt="Filtros de tiempo" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "game",
        title: "Eco-Juego",
        tag: "Retos y Premios",
        icon: Gamepad2,
        color: "text-orange-500",
        bgColor: "bg-orange-100",
        content: (
            <div className="space-y-6 text-sm text-green-800">
                <p>Aquí controlas los retos que animan a las personas a reciclar y ganar puntos.</p>
                <ul className="list-disc pl-5 space-y-6">
                    <li>
                        <strong>¿Cómo inventar un nuevo reto?</strong><br/>
                        Haz clic en el botón verde grande que dice "Nueva Misión". Se abrirá un formulario. Escribe el nombre del reto (ejemplo: 'Recicla 5 botellas'), explícalo un poco, elige cuántos puntos vas a regalar y presiona el botón "Crear". ¡El reto aparecerá de inmediato!
                        <div className="mt-4 flex flex-col gap-4">
                            {/* Imágenes pendientes para Eco-Juego */}
                        </div>
                    </li>
                    <li>
                        <strong>¿Cómo apagar un reto para que ya no salga?</strong><br/>
                        Busca el reto en la lista de misiones. A la derecha verás un pequeño interruptor. Si haces clic en él y lo apagas, el reto ya no le aparecerá a los jugadores, pero se quedará guardado ahí por si quieres volver a encenderlo mañana.
                    </li>
                    <li>
                        <strong>¿Cómo ver quién va ganando?</strong><br/>
                        Solo tienes que mirar la lista o tabla que dice "Ranking" o "Mejores Jugadores". Ahí verás ordenadas del primero al último a las personas que han ganado más puntos jugando.
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "map",
        title: "Mapas",
        tag: "Puntos de Reciclaje",
        icon: Map,
        color: "text-red-500",
        bgColor: "bg-red-100",
        content: (
            <div className="space-y-6 text-sm text-green-800">
                <p>Controla los lugares que las personas pueden ver en el mapa para ir a depositar su basura o reciclaje.</p>
                <ul className="list-disc pl-5 space-y-6">
                    <li>
                        <strong>¿Cómo poner un lugar nuevo en el mapa?</strong><br/>
                        Haz clic en el botón "Nuevo Punto". Verás un mensaje verde en la pantalla. Después, haz clic directamente en el dibujo del mapa, justo en el lugar exacto donde quieres poner la marca. Luego escribe el nombre del lugar a la derecha y presiona "Guardar".
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.58 PM (10).jpeg" 
                                alt="Crear punto 1" 
                                onOpen={onImageClick} 
                            />
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.58 PM (11).jpeg" 
                                alt="Crear punto 2" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                    <li>
                        <strong>¿Cómo ponerle una foto a un lugar del mapa?</strong><br/>
                        Cuando estés creando o editando un lugar, verás una opción en el panel derecho para subir o pegar una imagen. Haz clic ahí, busca la foto y guárdala. Cuando la gente toque el lugar en el mapa, verá esa foto.
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.59 PM (1).jpeg" 
                                alt="Subir foto 1" 
                                onOpen={onImageClick} 
                            />
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.59 PM.jpeg" 
                                alt="Subir foto 2" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                    <li>
                        <strong>¿Cómo esconder un lugar temporalmente?</strong><br/>
                        Si un basurero está en reparación y no quieres que la gente vaya, busca el lugar en la lista de la izquierda y haz clic en el interruptor para desactivarlo. Desaparecerá del mapa de inmediato sin necesidad de borrarlo para siempre.
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.59 PM (2).jpeg" 
                                alt="Ocultar punto 1" 
                                onOpen={onImageClick} 
                            />
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.59 PM (3).jpeg" 
                                alt="Ocultar punto 2" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "images",
        title: "Imágenes",
        tag: "Fotos de Inicio",
        icon: ImagePlus,
        color: "text-pink-500",
        bgColor: "bg-pink-100",
        content: (
            <div className="space-y-6 text-sm text-green-800">
                <p>Aquí decides qué imágenes grandes van a ir pasando una por una en la primera pantalla que ven todos al entrar a la página.</p>
                <ul className="list-disc pl-5 space-y-6">
                    <li>
                        <strong>¿Cómo subir una nueva foto a la portada?</strong><br/>
                        Busca el cuadro con líneas punteadas que dice "Subir imagen" y haz clic ahí. Selecciona una foto bonita de tu computadora. Luego, escribe un título y una frase corta para acompañarla. Finalmente, haz clic en "Guardar Imagen".
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ManualImage 
                                src="/Manual de usuario/crear nuevo slide.jpeg" 
                                alt="Crear nuevo slide" 
                                onOpen={onImageClick} 
                            />
                            <ManualImage 
                                src="/Manual de usuario/seleccionar imagen para slide.jpeg" 
                                alt="Seleccionar imagen" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                    <li>
                        <strong>¿Cómo cambiar el orden en que salen las fotos?</strong><br/>
                        Si quieres que una foto sea la primera en salir, busca la lista de fotos. Haz clic encima de la foto (sin soltar el botón del ratón), arrástrala hacia arriba hasta la primera posición, y suéltala.
                        <div className="mt-4 flex flex-col gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.59 PM (4).jpeg" 
                                alt="Arrastrar foto 1" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                    <li>
                        <strong>¿Cómo quitar una foto sin borrarla?</strong><br/>
                        Busca la foto en la lista. Junto a ella verás un pequeño dibujo de un "ojo". Si le haces clic, el ojo se cerrará y la foto ya no aparecerá en la página principal de los visitantes. Puedes volver a hacer clic para que aparezca de nuevo.
                        <div className="mt-4 flex flex-col gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.59 PM (5).jpeg" 
                                alt="Icono de ojo" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "security",
        title: "Notificaciones y Seguridad",
        tag: "Alertas del Sistema",
        icon: ShieldAlert,
        color: "text-amber-500",
        bgColor: "bg-amber-100",
        content: (
            <div className="space-y-6 text-sm text-green-800">
                <p>El sistema tiene formas automáticas de cuidar la página para que tú no tengas que preocuparte tanto.</p>
                <ul className="list-disc pl-5 space-y-6">
                    <li>
                        <strong>¿Cómo revisar un aviso o alarma urgente?</strong><br/>
                        Mira la campanita de notificaciones en la esquina superior derecha de tu pantalla. Si tiene un puntito rojo y se mueve, hay una alarma. Haz clic en la campanita y se abrirá una ventana lateral. Ahí podrás leer exactamente qué pasó (por ejemplo: "El sistema bloqueó una imagen prohibida").
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.51.59 PM (6).jpeg" 
                                alt="Campanita notificaciones 1" 
                                onOpen={onImageClick} 
                            />
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.52.00 PM (1).jpeg" 
                                alt="Campanita notificaciones 2" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                    <li>
                        <strong>¿Cómo limpiar los avisos viejos?</strong><br/>
                        Una vez que abras la campanita y leas qué sucedió, en la parte de abajo de esa ventana verás un botón que dice "Marcar todas como leídas". Haz clic ahí y el punto rojo de alerta desaparecerá.
                        <div className="mt-4 flex flex-col gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.52.00 PM.jpeg" 
                                alt="Marcar como leídas" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                    <li>
                        <strong>¿Qué pasa si me voy y dejo la página abierta?</strong><br/>
                        Si te paras de tu silla y no mueves el ratón ni escribes nada durante 5 minutos, la página activará un candado automático y se cerrará sola. Para volver a entrar y hacer cambios, tendrás que poner tu correo y contraseña otra vez. Esto es para que nadie toque tus cosas si te descuidas.
                        <div className="mt-4 flex flex-col gap-4">
                            <ManualImage 
                                src="/Manual de usuario/WhatsApp Image 2026-05-07 at 4.52.00 PM (2).jpeg" 
                                alt="Cierre automático" 
                                onOpen={onImageClick} 
                            />
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
];

export default function AdminHelp() {
    const [openSection, setOpenSection] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [scale, setScale] = useState(1);
    const [transformOrigin, setTransformOrigin] = useState("center");
    const containerRef = useRef(null);

    const sections = getManualSections(setPreviewImage);

    const closePreview = () => {
        setPreviewImage(null);
        setScale(1);
        setTransformOrigin("center");
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => {
        const newScale = Math.max(scale - 0.5, 1);
        setScale(newScale);
        if (newScale === 1) setTransformOrigin("center");
    };

    const handleImageDoubleClick = (e) => {
        e.stopPropagation();
        if (scale > 1) {
            setScale(1);
            setTransformOrigin("center");
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setTransformOrigin(`${x}% ${y}%`);
            setScale(2);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50/60 via-white to-emerald-50/40 min-h-screen">
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden"
                        onClick={closePreview}
                    >
                        <div className="absolute top-6 right-6 flex items-center gap-4 z-[1000]">
                            {/* Zoom Controls */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-xl"
                            >
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                                    className="p-1 hover:bg-white/10 rounded-lg text-white transition-colors disabled:opacity-30"
                                    disabled={scale <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                
                                <input 
                                    type="range"
                                    min="1"
                                    max="4"
                                    step="0.1"
                                    value={scale}
                                    onChange={(e) => { e.stopPropagation(); setScale(parseFloat(e.target.value)); }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-24 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-green-400"
                                />

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                                    className="p-1 hover:bg-white/10 rounded-lg text-white transition-colors disabled:opacity-30"
                                    disabled={scale >= 4}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>

                                <div className="w-[1px] h-4 bg-white/20 mx-1" />

                                <button
                                    onClick={(e) => { e.stopPropagation(); setScale(1); }}
                                    className="p-1 hover:bg-white/10 rounded-lg text-white transition-colors flex items-center gap-1.5"
                                    title="Restablecer"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span className="text-[10px] font-bold">{Math.round(scale * 100)}%</span>
                                </button>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors shadow-xl"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closePreview();
                                }}
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                        </div>

                        <motion.div
                            key={previewImage}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ 
                                scale: scale, 
                                opacity: 1,
                                cursor: scale > 1 ? "grab" : "zoom-in",
                                x: scale === 1 ? 0 : undefined,
                                y: scale === 1 ? 0 : undefined,
                                transformOrigin: transformOrigin
                            }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            drag={scale > 1}
                            dragConstraints={containerRef}
                            dragElastic={0.1}
                            dragMomentum={false}
                            transition={{ type: "spring", damping: 30, stiffness: 250 }}
                            className="relative max-w-7xl w-full max-h-full flex items-center justify-center select-none"
                            onDoubleClick={handleImageDoubleClick}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={previewImage}
                                alt="Vista previa"
                                className="max-w-[85%] max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10 pointer-events-none"
                            />
                        </motion.div>
                        
                        {scale === 1 && (
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-8 text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase"
                            >
                                Doble clic para ampliar en un punto
                            </motion.p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto px-6 py-8">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-md">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-green-950">Manual de Usuario</h1>
                            <p className="text-green-600 text-sm mt-1">
                                Guía completa para administradores de la plataforma Eco-It
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Info Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-green-100 rounded-2xl p-5 mb-8 shadow-sm flex gap-4 items-start"
                >
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-1">
                        <HelpCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-green-900 mb-1">¿Cómo usar este manual?</h3>
                        <p className="text-sm text-green-700 leading-relaxed">
                            A continuación encontrarás explicadas cada una de las secciones del panel de administración. 
                            Haz clic en cualquier categoría para expandir la información y conocer las opciones y acciones 
                            que tienes disponibles en dicho módulo.
                        </p>
                    </div>
                </motion.div>

                {/* Accordion */}
                <div className="space-y-4">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        const isOpen = openSection === section.id;

                        return (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 + (index * 0.05) }}
                                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                                    isOpen ? "border-green-300 shadow-md" : "border-green-100 shadow-sm hover:border-green-200"
                                }`}
                            >
                                <button
                                    onClick={() => setOpenSection(isOpen ? null : section.id)}
                                    className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-green-50/50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl ${section.bgColor} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className={`w-5 h-5 ${section.color}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h2 className="font-bold text-green-950 text-lg">{section.title}</h2>
                                                {section.tag && (
                                                    <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wide border border-green-100 hidden sm:inline-block">
                                                        {section.tag}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronDown 
                                        className={`w-5 h-5 text-green-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                                    />
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        >
                                            <motion.div 
                                                initial={{ y: -10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                                className="px-6 pb-6 pt-2 border-t border-green-50 ml-[68px]"
                                            >
                                                {section.content}
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs text-green-400 font-medium">Eco-It Admin System v1.0</p>
                </div>

            </div>
        </div>
    );
}
