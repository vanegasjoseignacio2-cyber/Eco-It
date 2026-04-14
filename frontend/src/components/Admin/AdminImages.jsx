// AdminImages.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Panel de administración de imágenes del carrusel para Eco-It.
//
// FLUJO ACTUAL (sin backend):
//   - Las imágenes se suben directo a Cloudinary desde el navegador
//     usando un Upload Preset sin firma (unsigned).
//   - Los metadatos (título, subtítulo, tag, orden, activo) se guardan
//     en localStorage (clave: "ecoit_carousel_slides").
//   - EcoCarousel.jsx lee los slides desde el mismo localStorage y
//     escucha el evento personalizado "ecoit_carousel_updated" para
//     re-renderizarse en tiempo real sin necesidad de recargar la página.
//
// FLUJO CON BACKEND (cuando esté listo):
//   Busca todos los bloques marcados con // [TODO:BACKEND] y conéctalos.
//
// CLOUDINARY:
//   1. Crea un "Upload Preset" sin firmar en tu dashboard:
//      Settings → Upload → Add upload preset → Unsigned → guarda el nombre.
//   2. Rellena las variables de entorno:
//      VITE_CLOUDINARY_CLOUD_NAME=tu_cloud
//      VITE_CLOUDINARY_UPLOAD_PRESET=tu_preset
//   3. Las URLs devueltas ya son de Cloudinary con transformaciones automáticas.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
    obtenerSlidesAdmin,
    crearSlide,
    actualizarSlide,
    eliminarSlide,
    reordenarSlides as reordenarSlidesAPI
} from "../../services/api";
import {
    Image,
    Plus,
    Trash2,
    Pencil,
    GripVertical,
    Eye,
    EyeOff,
    Save,
    X,
    Upload,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ExternalLink,
    Tag,
    Type,
    AlignLeft,
    LayoutList,
    Leaf,
    RefreshCw,
    ArrowUp,
    ArrowDown,
} from "lucide-react";

// ─── CLOUDINARY CONFIG ────────────────────────────────────────────────────────
const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME    || "dwx3v7vex";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ecoit_images";
const CLOUDINARY_FOLDER = "ecoit/carousel";

// ─── LOCAL STORAGE KEY ────────────────────────────────────────────────────────
// Reservado para fallback o caché si se desea, pero ya no es la fuente de verdad.
const LS_KEY = "ecoit_carousel_slides";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
// Helper para manipular transformaciones de Cloudinary
function getCloudinaryVariation(url, transformation) {
    if (!url || !url.includes("res.cloudinary.com")) return url;
    // Busca el segmento de transformaciones (después de /upload/)
    return url.replace(/\/upload\/[^/]+\//, `/upload/${transformation}/`);
}

function cloudUrl(publicId, w = 1920) {
    // c_limit asegura que la imagen no se recorte y mantenga su proporción original
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_limit,w_${w},q_auto,f_auto/${publicId}`;
}

// ─── SLIDE VACÍO ─────────────────────────────────────────────────────────────
const EMPTY_SLIDE = { tag: "", title: "", subtitle: "", src: "", publicId: "", alt: "", active: true, width: null, height: null };

// ─── ANIMACIONES ──────────────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminImages() {
    const { token } = useAuth();

    const [slides,  setSlides]  = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editing,  setEditing]  = useState(null);
    const [form,     setForm]     = useState(EMPTY_SLIDE);

    const [uploading,  setUploading]  = useState(false);
    const [uploadPct,  setUploadPct]  = useState(0);
    const fileInputRef = useRef(null);

    const [toast,       setToast]       = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });

    // ─── Cargar slides ────────────────────────────────────────────────────────
    useEffect(() => { fetchSlides(); }, [token]);

    const fetchSlides = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await obtenerSlidesAdmin(token);
            if (data.success) {
                setSlides(data.slides);
            } else {
                showToast(data.mensaje || "Error al cargar los slides", "error");
            }
        } catch (err) {
            showToast("No se pudo conectar con el servidor", "error");
        } finally {
            setLoading(false);
        }
    };

    // ─── Toast ────────────────────────────────────────────────────────────────
    const showToast = useCallback((msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    }, []);

    // ─── Persistir slides (ya no se usa saveToLS) ────────────────────────────
    const persist = useCallback(async (newSlides) => {
        setSlides(newSlides);
        // El reordenamiento se maneja ahora por handleReorder que llama a la API
    }, []);

    // ─── Cloudinary: subida directa ───────────────────────────────────────────
    const uploadToCloudinary = async (file) => {
        setUploading(true);
        setUploadPct(0);

        const fd = new FormData();
        fd.append("file",          file);
        fd.append("upload_preset", UPLOAD_PRESET);
        fd.append("folder",        CLOUDINARY_FOLDER);
        fd.append("tags",          "ecoit,carousel");

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) setUploadPct(Math.round((e.loaded / e.total) * 100));
            });

            xhr.addEventListener("load", () => {
                setUploading(false);
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error("Error al subir la imagen a Cloudinary"));
                }
            });

            xhr.addEventListener("error", () => {
                setUploading(false);
                reject(new Error("Error de red al subir la imagen"));
            });

            xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
            xhr.send(fd);
        });
    };

    // ─── Selección de archivo ─────────────────────────────────────────────────
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            showToast("Solo se permiten imágenes (JPG, PNG, WebP…)", "error"); return;
        }
        if (file.size > 10 * 1024 * 1024) {
            showToast("La imagen no puede superar 10 MB", "error"); return;
        }
        try {
            const data = await uploadToCloudinary(file);
            setForm((f) => ({
                ...f,
                src:      cloudUrl(data.public_id),
                publicId: data.public_id,
                alt:      f.alt || file.name.replace(/\.[^.]+$/, ""),
                // Dimensiones originales de Cloudinary → evitan colapso de layout al renderizar
                width:    data.width  || null,
                height:   data.height || null,
            }));
            showToast("Imagen subida correctamente a Cloudinary ✓");
        } catch (err) {
            showToast(err.message || "No se pudo subir la imagen", "error");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // ─── Abrir / cerrar formulario ────────────────────────────────────────────
    const openCreate = () => { setEditing(null); setForm(EMPTY_SLIDE); setShowForm(true); };
    const openEdit   = (slide) => {
        setEditing(slide);
        setForm({ tag: slide.tag || "", title: slide.title || "", subtitle: slide.subtitle || "",
                  src: slide.src || "", publicId: slide.publicId || "", alt: slide.alt || "",
                  active: slide.active ?? true,
                  width:  slide.width  || null,
                  height: slide.height || null });
        setShowForm(true);
    };
    const closeForm  = () => { setShowForm(false); setEditing(null); setForm(EMPTY_SLIDE); };

    // ─── Guardar slide ────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!form.src)          { showToast("Debes subir una imagen primero", "error"); return; }
        if (!form.title.trim()) { showToast("El título es obligatorio", "error"); return; }

        try {
            if (editing) {
                const res = await actualizarSlide(token, editing._id, form);
                if (res.success) {
                    setSlides(slides.map((s) => s._id === editing._id ? res.slide : s));
                    showToast("Slide actualizado correctamente");
                }
            } else {
                const res = await crearSlide(token, form);
                if (res.success) {
                    setSlides([...slides, res.slide]);
                    showToast("Slide creado correctamente");
                }
            }
            closeForm();
        } catch (err) {
            showToast(err.message || "Error al guardar el slide", "error");
        }
    };

    // ─── Toggle activo ────────────────────────────────────────────────────────
    const toggleActive = async (slide) => {
        try {
            const res = await actualizarSlide(token, slide._id, { active: !slide.active });
            if (res.success) {
                setSlides(slides.map((s) => s._id === slide._id ? res.slide : s));
                showToast(res.slide.active ? "Slide activado" : "Slide ocultado");
            }
        } catch { showToast("No se pudo cambiar el estado", "error"); }
    };

    // ─── Eliminar slide ───────────────────────────────────────────────────────
    const confirmDelete = async () => {
        const { id, title } = deleteModal;
        setDeleteModal({ open: false, id: null, title: "" });
        try {
            const res = await eliminarSlide(token, id);
            if (res.success) {
                setSlides(slides.filter((s) => s._id !== id));
                showToast(`"${title}" eliminado`);
            }
        } catch { showToast("Error al eliminar el slide", "error"); }
    };

    // ─── Mover slide ──────────────────────────────────────────────────────────
    const moveSlide = async (index, dir) => {
        const swapped = [...slides];
        const target  = index + dir;
        if (target < 0 || target >= swapped.length) return;
        [swapped[index], swapped[target]] = [swapped[target], swapped[index]];
        
        setSlides(swapped);
        try {
            await reordenarSlidesAPI(token, swapped.map(s => s._id));
        } catch {
            showToast("Error al guardar el nuevo orden", "error");
            fetchSlides(); // Revertir
        }
    };

    const handleReorder = async (newOrder) => {
        setSlides(newOrder);
        try {
            await reordenarSlidesAPI(token, newOrder.map(s => s._id));
        } catch {
            showToast("Error al guardar el nuevo orden", "error");
            fetchSlides(); // Revertir
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50/60 via-white to-emerald-50/40 p-6">

            {/* ── Toast ── */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0,   scale: 1 }}
                        exit={{   opacity: 0, y: -12,  scale: 0.95 }}
                        className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold
                            ${toast.type === "error"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-green-50 text-green-800 border border-green-200"}`}
                    >
                        {toast.type === "error"
                            ? <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            : <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Modal confirmación borrado ── */}
            <AnimatePresence>
                {deleteModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/20 backdrop-blur-sm"
                        onClick={() => setDeleteModal({ open: false, id: null, title: "" })}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 12 }}
                            animate={{ opacity: 1, scale: 1,    y: 0  }}
                            exit={{   opacity: 0, scale: 0.92, y: 12  }}
                            transition={{ type: "spring", stiffness: 340, damping: 28 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4"
                            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.14), 0 0 0 1px rgba(74,222,128,0.12)" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="font-bold text-green-900 text-base mb-1.5 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                Eliminar slide
                            </h3>
                            <p className="text-sm text-green-600/80 mb-4 leading-relaxed">
                                ¿Eliminar <span className="font-semibold text-green-800">"{deleteModal.title}"</span>?
                                Esta acción no se puede deshacer.
                            </p>
                            <div className="flex gap-2">
                                <button onClick={confirmDelete}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-all">
                                    Eliminar
                                </button>
                                <button onClick={() => setDeleteModal({ open: false, id: null, title: "" })}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-green-50 hover:bg-green-100 text-green-700 transition-all">
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
            >
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-sm">
                            <Image className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-green-950">Imágenes del Carrusel</h1>
                    </div>
                    <p className="text-sm text-green-500 ml-10">
                        Gestiona los slides que aparecen en el carrusel principal del frontend.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchSlides}
                        className="p-2.5 rounded-xl border border-green-100 hover:bg-green-50 text-green-500 transition-all"
                        title="Recargar">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-green-600 text-white text-sm font-semibold shadow hover:shadow-md transition-all">
                        <Plus className="w-4 h-4" />
                        Nuevo slide
                    </motion.button>
                </div>
            </motion.div>

            {/* ── Layout: lista + panel de edición ── */}
            <div className={`flex gap-6 ${showForm ? "lg:grid lg:grid-cols-[1fr_420px]" : ""}`}>

                {/* Lista */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-green-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <LayoutList className="w-4 h-4 text-green-400" />
                                <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
                                    {slides.length} {slides.length === 1 ? "slide" : "slides"}
                                </span>
                            </div>
                            <span className="text-[10px] text-green-300">
                                Arrastra o usa ↑↓ para reordenar
                            </span>
                        </div>

                        {loading ? (
                            <div className="divide-y divide-green-50">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                                        <div className="w-20 h-14 rounded-xl bg-green-50 flex-shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-green-50 rounded w-2/3" />
                                            <div className="h-2 bg-green-50 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : slides.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
                                    <Image className="w-7 h-7 text-green-200" />
                                </div>
                                <p className="text-sm text-green-400 font-medium">No hay slides todavía</p>
                                <button onClick={openCreate}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 text-sm font-semibold transition-all">
                                    <Plus className="w-4 h-4" />
                                    Crear el primer slide
                                </button>
                            </motion.div>
                        ) : (
                            <Reorder.Group axis="y" values={slides} onReorder={handleReorder} className="divide-y divide-green-50">
                                <AnimatePresence initial={false}>
                                    {slides.map((slide, index) => (
                                        <SlideRow
                                            key={slide._id}
                                            slide={slide}
                                            index={index}
                                            total={slides.length}
                                            isEditing={editing?._id === slide._id}
                                            onEdit={() => openEdit(slide)}
                                            onDelete={() => setDeleteModal({ open: true, id: slide._id, title: slide.title })}
                                            onToggleActive={() => toggleActive(slide)}
                                            onMoveUp={() => moveSlide(index, -1)}
                                            onMoveDown={() => moveSlide(index, 1)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </Reorder.Group>
                        )}
                    </div>

                    {/* Nota */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        className="mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-lime-50 border border-lime-100">
                        <Leaf className="w-4 h-4 text-lime-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-lime-700 leading-relaxed">
                            <span className="font-bold">Backend conectado:</span> los slides se guardan en la base de datos de MongoDB
                            y las imágenes residen en Cloudinary. Los cambios se verán reflejados en el Home inmediatamente.
                        </p>
                    </motion.div>
                </div>

                {/* Panel edición */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, x: 40, scale: 0.97 }}
                            animate={{ opacity: 1, x: 0,  scale: 1   }}
                            exit={{   opacity: 0, x: 40, scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                            className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden flex flex-col"
                            style={{ maxHeight: "85vh", position: "sticky", top: "1.5rem" }}
                        >
                            <SlideForm
                                form={form}
                                setForm={setForm}
                                editing={editing}
                                uploading={uploading}
                                uploadPct={uploadPct}
                                fileInputRef={fileInputRef}
                                onFileChange={handleFileChange}
                                onSave={handleSave}
                                onClose={closeForm}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── SUB-COMPONENTE: Fila de slide ────────────────────────────────────────────
function SlideRow({ slide, index, total, isEditing, onEdit, onDelete, onToggleActive, onMoveUp, onMoveDown }) {
    return (
        <Reorder.Item
            value={slide}
            as="div"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, x: -20 }}
            className={`flex items-center gap-4 px-6 py-4 group transition-colors
                ${isEditing ? "bg-lime-50/60" : "hover:bg-green-50/50"}
                ${!slide.active ? "opacity-60" : ""}`}
        >
            {/* Grip */}
            <div className="text-green-200 hover:text-green-400 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none">
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Thumbnail */}
            <div className="w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-green-50 border border-green-100">
                {slide.src ? (
                    <img
                        src={getCloudinaryVariation(slide.src, "c_fill,w_160,h_112")}
                        alt={slide.alt || slide.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-5 h-5 text-green-200" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    {slide.tag && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-lime-100 text-lime-700 flex-shrink-0">
                            {slide.tag}
                        </span>
                    )}
                    <p className="text-sm font-semibold text-green-900 truncate">{slide.title}</p>
                </div>
                {slide.subtitle && (
                    <p className="text-xs text-green-400 truncate">{slide.subtitle}</p>
                )}
            </div>

            {/* Badge activo */}
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 hidden sm:block
                ${slide.active
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200/80"
                    : "bg-gray-100 text-gray-400 border border-gray-200/80"}`}>
                {slide.active ? "Activo" : "Oculto"}
            </span>

            {/* Acciones */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onMoveUp} disabled={index === 0}
                    className="p-1.5 rounded-lg hover:bg-green-100 text-green-400 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    title="Subir">
                    <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button onClick={onMoveDown} disabled={index === total - 1}
                    className="p-1.5 rounded-lg hover:bg-green-100 text-green-400 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    title="Bajar">
                    <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button onClick={onToggleActive}
                    className="p-1.5 rounded-lg hover:bg-green-100 text-green-400 transition-all"
                    title={slide.active ? "Ocultar" : "Mostrar"}>
                    {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={onEdit}
                    className="p-1.5 rounded-lg hover:bg-lime-100 text-lime-500 transition-all"
                    title="Editar">
                    <Pencil className="w-4 h-4" />
                </button>
                <button onClick={onDelete}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-all"
                    title="Eliminar">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </Reorder.Item>
    );
}

// ─── SUB-COMPONENTE: Formulario crear / editar ────────────────────────────────
function SlideForm({ form, setForm, editing, uploading, uploadPct, fileInputRef, onFileChange, onSave, onClose }) {
    const upd = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    return (
        <>
            {/* Header */}
            <div className="px-5 py-4 border-b border-green-50 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider">
                            {editing ? "Editando slide" : "Nuevo slide"}
                        </p>
                        <h3 className="font-bold text-green-950 mt-0.5 flex items-center gap-2">
                            <Image className="w-4 h-4 text-green-500" />
                            {editing ? (editing.title || "Sin título") : "Crear slide"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/60 transition-colors">
                        <X className="w-4 h-4 text-green-400" />
                    </button>
                </div>
            </div>

            {/* Campos scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

                {/* ── Imagen ── */}
                <Field label="Imagen del slide *">
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`relative w-full h-36 rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-all
                            ${uploading
                                ? "border-lime-300 bg-lime-50 cursor-wait"
                                : form.src
                                    ? "border-green-200 hover:border-lime-400"
                                    : "border-green-200 hover:border-lime-400 bg-green-50/50 hover:bg-lime-50/40"}`}
                    >
                        {form.src ? (
                            <>
                                <img
                                    src={getCloudinaryVariation(form.src, "c_fill,w_600,h_300")}
                                    alt="Preview"
                                    className="w-full h-full object-contain bg-green-50"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white text-xs font-semibold flex items-center gap-1.5">
                                        <Upload className="w-4 h-4" />
                                        Cambiar imagen
                                    </p>
                                </div>
                            </>
                        ) : uploading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 px-6">
                                <Loader2 className="w-6 h-6 text-lime-500 animate-spin" />
                                <div className="w-full h-1.5 bg-lime-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadPct}%` }}
                                    />
                                </div>
                                <p className="text-xs text-lime-600 font-semibold">{uploadPct}% subido a Cloudinary</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-2">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-green-400" />
                                </div>
                                <p className="text-xs text-green-500 font-medium">Haz clic para subir la imagen</p>
                                <p className="text-[10px] text-green-300">JPG, PNG, WebP — máx. 10 MB</p>
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onFileChange}
                    />

                    {form.publicId && (
                        <a
                            href={`https://console.cloudinary.com/console/media_library/search?q=${form.publicId}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[10px] text-green-400 hover:text-green-600 mt-1.5 transition-colors"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Ver en Cloudinary
                        </a>
                    )}
                </Field>

                {/* ── Tag ── */}
                <Field label="Tag de categoría" icon={Tag}>
                    <input type="text" placeholder="Ej: Energía Limpia, Smart Cities…"
                        value={form.tag} maxLength={30}
                        onChange={(e) => upd("tag", e.target.value)}
                        className={inputCls} />
                </Field>

                {/* ── Título ── */}
                <Field label="Título principal *" icon={Type}>
                    <textarea placeholder={"Ej: Soluciones\nSostenibles"}
                        value={form.title} maxLength={60} rows={2}
                        onChange={(e) => upd("title", e.target.value)}
                        className={inputCls + " resize-none"} />
                    <p className="text-[10px] text-green-300 mt-1">
                        Usa salto de línea para dividir el título en dos líneas.
                    </p>
                </Field>

                {/* ── Subtítulo ── */}
                <Field label="Subtítulo" icon={AlignLeft}>
                    <input type="text" placeholder="Descripción breve del slide"
                        value={form.subtitle} maxLength={100}
                        onChange={(e) => upd("subtitle", e.target.value)}
                        className={inputCls} />
                </Field>

                {/* ── Alt text ── */}
                <Field label="Texto alternativo (accesibilidad)">
                    <input type="text" placeholder="Ej: Paneles solares en paisaje natural"
                        value={form.alt} maxLength={80}
                        onChange={(e) => upd("alt", e.target.value)}
                        className={inputCls} />
                </Field>

                {/* ── Toggle activo ── */}
                <Field label="Visibilidad en el carrusel">
                    <div className="flex items-center gap-3 py-1">
                        <button
                            type="button"
                            onClick={() => upd("active", !form.active)}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-300
                                ${form.active ? "bg-green-500" : "bg-gray-200"}`}
                        >
                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300
                                ${form.active ? "left-5" : "left-0.5"}`} />
                        </button>
                        <span className={`text-sm font-medium ${form.active ? "text-green-700" : "text-gray-400"}`}>
                            {form.active ? "Visible en el carrusel" : "Oculto en el carrusel"}
                        </span>
                    </div>
                </Field>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-green-50 flex gap-2">
                <button onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-green-100 text-green-600 text-sm font-semibold hover:bg-green-50 transition-colors">
                    Cancelar
                </button>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={onSave} disabled={uploading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-green-600 text-white text-sm font-semibold shadow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-wait"
                >
                    <Save className="w-4 h-4" />
                    {editing ? "Guardar cambios" : "Crear slide"}
                </motion.button>
            </div>
        </>
    );
}

// ─── Helpers de UI ────────────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-green-100 bg-green-50/50 text-sm text-green-900 placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all";

function Field({ label, icon: Icon, children }) {
    return (
        <div>
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 uppercase tracking-wider mb-1.5">
                {Icon && <Icon className="w-3 h-3" />}
                {label}
            </label>
            {children}
        </div>
    );
}