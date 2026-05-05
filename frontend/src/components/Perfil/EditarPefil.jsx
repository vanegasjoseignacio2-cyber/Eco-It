import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import Toast from "../ui/Toast";
import ConfirmationModal from "../ui/ConfirmationModal";
import { useAuth } from "../../context/AuthContext";
import { actualizarPerfil, eliminarPerfil } from "../../services/api";
import { useOfensiveValidator } from "../Contact/ContactForm";
import {
    Mail, User, Calendar, Phone,
    Save, X, Trash2, Leaf, ArrowLeft,
    Shield, Sparkles, AlertCircle, ShieldAlert,
} from "lucide-react";

export default function EditProfile() {
    const { usuario, token, actualizarUsuario, logout } = useAuth();
    const navigate = useNavigate();
    const { validar } = useOfensiveValidator();

    const [formData, setFormData] = useState({
        email: "", nombre: "", apellido: "", edad: "", telefono: "",
    });
    const [loading, setLoading]           = useState(false);
    const [toast, setToast]               = useState({ message: "", type: "" });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // Validation state
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showOfensiveModal, setShowOfensiveModal] = useState(false);

    useEffect(() => {
        if (usuario) {
            setFormData({
                email:    usuario.email    || "",
                nombre:   usuario.nombre   || "",
                apellido: usuario.apellido || "",
                edad:     usuario.edad     || "",
                telefono: usuario.telefono || "",
            });
        }
    }, [usuario]);

    const isValidName = (v) => {
        const base = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/.test(v.trim());
        if (!base) return false;
        const res = validar(v);
        return res.valido;
    };

    const isValidAge = (v) => {
        if (!v) return false;
        const edad = Number(v);
        return /^\d+$/.test(v) && !isNaN(edad) && edad >= 6 && edad <= 110;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "nombre" || name === "apellido") {
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;

            const isOffensive = !validar(value).valido;
            if (isOffensive && value.trim().length >= 3) {
                setShowOfensiveModal(true);
            }

            let error = "";
            if (value.trim().length > 0 && !isValidName(value)) {
                error = isOffensive && value.trim().length >= 3
                    ? "Contiene palabras no permitidas"
                    : "Solo letras, mínimo 3 caracteres";
            }
            setErrors(prev => ({ ...prev, [name]: error }));
        } else if (name === "edad") {
            newValue = value.replace(/[^0-9]/g, '').slice(0, 3);
            let error = "";
            if (newValue.length > 0 && !isValidAge(newValue)) {
                error = "Ingresa una edad válida (6-110)";
            }
            setErrors(prev => ({ ...prev, [name]: error }));
        } else if (name === "telefono") {
            newValue = value.replace(/\D/g, "").slice(0, 10);
            let error = "";
            if (newValue.length > 0 && !/^3\d{9}$/.test(newValue)) {
                error = "Número inválido (ej: 3201234567)";
            }
            setErrors(prev => ({ ...prev, [name]: error }));
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleKeyDown = (e, name) => {
        if (name === "edad" && ['e', 'E', '+', '-', '.', ','].includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const formValid = 
        isValidName(formData.nombre) && 
        isValidName(formData.apellido) && 
        isValidAge(formData.edad) && 
        /^3\d{9}$/.test(formData.telefono);

    const showToast  = (message, type = "success") => setToast({ message, type });
    const closeToast = () => setToast({ message: "", type: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const respuesta = await actualizarPerfil(formData);
            if (respuesta.success) {
                actualizarUsuario({ ...usuario, ...formData });
                showToast("Cambios guardados exitosamente!", "success");
                setTimeout(() => navigate("/perfil"), 1500);
            }
        } catch (error) {
            showToast("Error al guardar cambios: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel      = () => window.history.back();
    const handleDeleteClick = () => setShowDeleteModal(true);

    const handleConfirmDelete = async () => {
        try {
            const respuesta = await eliminarPerfil();
            if (respuesta.success) {
                showToast("Cuenta eliminada exitosamente", "success");
                setTimeout(() => { logout(); navigate('/login'); }, 1500);
            }
        } catch (error) {
            showToast("Error al eliminar cuenta: " + error.message, "error");
        }
    };

    const getInitials = () => {
        if (formData.nombre && formData.apellido)
            return `${formData.nombre.charAt(0)}${formData.apellido.charAt(0)}`.toUpperCase();
        if (formData.nombre) return formData.nombre.charAt(0).toUpperCase();
        if (formData.email)  return formData.email.charAt(0).toUpperCase();
        return "?";
    };

    const fields = [
        { name: "nombre",   label: "Nombre",   icon: User,     type: "text",   placeholder: "Tu nombre"   },
        { name: "apellido", label: "Apellido",  icon: User,     type: "text",   placeholder: "Tu apellido" },
        { name: "edad",     label: "Edad",      icon: Calendar, type: "number", placeholder: "Tu edad", min: 1, max: 120 },
        { name: "telefono", label: "Teléfono",  icon: Phone,    type: "tel",    placeholder: "Tu teléfono" },
        { name: "email",    label: "Correo",    icon: Mail,     type: "email",  placeholder: "tu@email.com", readOnly: true },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
                .edit-root { font-family: 'Sora', sans-serif; }
                .card-glass {
                    background: rgba(255,255,255,0.75);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(74,222,128,0.35);
                    box-shadow: 0 4px 24px rgba(16,185,129,0.08);
                }
                .field-input {
                    background: rgba(240,253,244,0.8) !important;
                    border: 1px solid rgba(74,222,128,0.35) !important;
                    color: #14532d !important;
                    transition: all 0.2s ease;
                    outline: none;
                }
                .field-input::placeholder { color: rgba(20,83,45,0.35); }
                .field-input:focus {
                    border-color: rgba(22,163,74,0.7) !important;
                    box-shadow: 0 0 0 3px rgba(74,222,128,0.18), 0 0 20px rgba(74,222,128,0.1) !important;
                    background: rgba(220,252,231,0.9) !important;
                }
                .field-input:read-only {
                    opacity: 0.45;
                    cursor: not-allowed;
                }
                .field-input::-webkit-inner-spin-button { opacity: 0.3; }
            `}</style>

            <div className="edit-root min-h-screen flex flex-col"
                 style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #ecfdf5 70%, #f0fdf4 100%)" }}>

                <Navbar />

                {/* Orbes de fondo */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <motion.div
                        animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.18, 0.1] }}
                        transition={{ duration: 9, repeat: Infinity }}
                        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(74,222,128,0.18) 0%, transparent 70%)" }}
                    />
                    <motion.div
                        animate={{ scale: [1, 1.08, 1], opacity: [0.07, 0.13, 0.07] }}
                        transition={{ duration: 13, repeat: Infinity, delay: 4 }}
                        className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)" }}
                    />
                    <div className="absolute inset-0 opacity-[0.025]"
                         style={{
                             backgroundImage: "linear-gradient(rgba(74,222,128,1) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,1) 1px, transparent 1px)",
                             backgroundSize: "80px 80px"
                         }} />
                </div>

                <main className="flex-1 mt-16 relative z-10 py-12 px-4">
                    <div className="max-w-4xl mx-auto">

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-10"
                        >
                            <motion.button
                                onClick={handleCancel}
                                whileHover={{ x: -4 }}
                                className="flex items-center gap-2 text-sm mb-5 transition-colors"
                                style={{ color: "rgba(21,128,61,0.7)" }}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Volver al perfil
                            </motion.button>

                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                     style={{ background: "rgba(74,222,128,0.18)", border: "1px solid rgba(74,222,128,0.4)" }}>
                                    <Shield className="w-4 h-4" style={{ color: "#16a34a" }} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest"
                                      style={{ color: "rgba(21,128,61,0.6)" }}>
                                    Editar cuenta
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold"
                                style={{ color: "#14532d", letterSpacing: "-1.5px" }}>
                                Tu <span style={{ color: "#16a34a" }}>Información</span>
                            </h1>
                        </motion.div>

                        {/* Layout split */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                            {/* ── Panel izquierdo: Avatar preview ── */}
                            <motion.div
                                initial={{ opacity: 0, x: -24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="lg:col-span-2"
                            >
                                <div className="card-glass rounded-3xl p-8 text-center sticky top-24">
                                    {/* Avatar live preview */}
                                    <div className="relative inline-block mb-6">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                                            className="absolute rounded-full"
                                            style={{
                                                inset: "-3px",
                                                background: "conic-gradient(from 0deg, #4ade80, #059669, #065f46, transparent, #4ade80)",
                                            }}
                                        />
                                        <motion.div
                                            key={getInitials()}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="relative w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black"
                                            style={{
                                                background: "linear-gradient(145deg, #bbf7d0, #86efac, #4ade80)",
                                                color: "#14532d",
                                                boxShadow: "0 0 0 3px rgba(74,222,128,0.4), 0 0 30px rgba(74,222,128,0.18)",
                                                zIndex: 1,
                                            }}
                                        >
                                            {getInitials()}
                                        </motion.div>
                                    </div>

                                    {/* Nombre preview */}
                                    <AnimatePresence mode="wait">
                                        <motion.h3
                                            key={formData.nombre + formData.apellido}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            className="text-xl font-bold mb-1"
                                            style={{ color: "#14532d" }}
                                        >
                                            {formData.nombre || "Tu"} {formData.apellido || "Nombre"}
                                        </motion.h3>
                                    </AnimatePresence>

                                    <p className="text-sm mb-8" style={{ color: "rgba(21,128,61,0.6)" }}>
                                        {formData.email || "tu@email.com"}
                                    </p>

                                    {/* Info extra */}
                                    <div className="space-y-2 text-left">
                                        {[
                                            { label: "Edad",     value: formData.edad     || "—" },
                                            { label: "Teléfono", value: formData.telefono || "—" },
                                        ].map(item => (
                                            <div key={item.label}
                                                 className="flex justify-between items-center px-3 py-2 rounded-xl"
                                                 style={{ background: "rgba(220,252,231,0.7)", border: "1px solid rgba(74,222,128,0.25)" }}>
                                                <span className="text-xs" style={{ color: "rgba(21,128,61,0.55)" }}>
                                                    {item.label}
                                                </span>
                                                <span className="text-xs font-semibold" style={{ color: "#15803d" }}>
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex items-center justify-center gap-2 text-xs"
                                         style={{ color: "rgba(21,128,61,0.4)" }}>
                                        <Sparkles className="w-3 h-3" />
                                        Vista previa en tiempo real
                                    </div>
                                </div>
                            </motion.div>

                            {/* ── Panel derecho: Formulario ── */}
                            <motion.div
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="lg:col-span-3"
                            >
                                <div className="card-glass rounded-3xl p-6 sm:p-8">

                                    <div className="flex items-center gap-2 mb-7">
                                        <Leaf className="w-4 h-4" style={{ color: "#4ade80" }} />
                                        <h3 className="text-xs font-bold uppercase tracking-widest"
                                            style={{ color: "rgba(21,128,61,0.65)" }}>
                                            Datos personales
                                        </h3>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {fields.map((field, i) => (
                                            <motion.div
                                                key={field.name}
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 + i * 0.08 }}
                                            >
                                                <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                                                       style={{ color: focusedField === field.name ? "#16a34a" : "rgba(21,128,61,0.55)",
                                                                transition: "color 0.2s" }}>
                                                    {field.label}
                                                    {field.readOnly && (
                                                        <span className="ml-2 normal-case tracking-normal font-normal opacity-50">
                                                            (no editable)
                                                        </span>
                                                    )}
                                                </label>
                                                <div className="relative">
                                                    <field.icon
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors"
                                                        style={{ color: focusedField === field.name ? "#16a34a" : "rgba(22,163,74,0.5)" }}
                                                    />
                                                    <input
                                                        type={field.type}
                                                        name={field.name}
                                                        value={formData[field.name]}
                                                        onChange={handleChange}
                                                        onKeyDown={(e) => handleKeyDown(e, field.name)}
                                                        onFocus={() => setFocusedField(field.name)}
                                                        onBlur={() => {
                                                            setFocusedField(null);
                                                            handleBlur(field.name);
                                                        }}
                                                        placeholder={field.placeholder}
                                                        readOnly={field.readOnly}
                                                        min={field.min}
                                                        max={field.max}
                                                        disabled={loading}
                                                        className={`field-input w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium disabled:opacity-50 transition-all ${
                                                            errors[field.name] && touched[field.name] ? "!border-red-400 !bg-red-50" : ""
                                                        }`}
                                                    />
                                                </div>
                                                <AnimatePresence>
                                                    {errors[field.name] && touched[field.name] && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -5 }}
                                                            className="flex items-center gap-1.5 mt-2 text-xs text-red-600 font-semibold"
                                                        >
                                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                            {errors[field.name]}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}

                                        {/* Botones */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.9 }}
                                            className="pt-4 space-y-3"
                                        >
                                            <div className="grid grid-cols-2 gap-3">
                                                <motion.button
                                                    type="submit"
                                                    disabled={loading || !formValid}
                                                    whileHover={formValid && !loading ? { scale: 1.02, boxShadow: "0 0 24px rgba(74,222,128,0.3)" } : {}}
                                                    whileTap={formValid && !loading ? { scale: 0.97 } : {}}
                                                    className={`py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${!formValid && !loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    style={{
                                                        background: "linear-gradient(135deg, #16a34a, #059669)",
                                                        color: "#f0fdf4",
                                                    }}
                                                >
                                                    {loading ? (
                                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <Save className="w-4 h-4" />
                                                    )}
                                                    {loading ? "Guardando..." : "Guardar"}
                                                </motion.button>

                                                <motion.button
                                                    type="button"
                                                    onClick={handleCancel}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                                                    style={{
                                                        background: "rgba(220,252,231,0.6)",
                                                        border: "1px solid rgba(74,222,128,0.3)",
                                                        color: "rgba(21,128,61,0.8)",
                                                    }}
                                                >
                                                    <X className="w-4 h-4" />
                                                    Cancelar
                                                </motion.button>
                                            </div>

                                            {/* Eliminar cuenta */}
                                            <motion.button
                                                type="button"
                                                onClick={handleDeleteClick}
                                                whileHover={{ scale: 1.01, backgroundColor: "rgba(239,68,68,0.18)" ,color:"#ef4444"}}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                                                style={{
                                                    background: "rgba(239,68,68,0.08)",
                                                    border: "1px solid rgba(239,68,68,0.25)",
                                                    color:  "#f87171" ,
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Eliminar mi cuenta
                                            </motion.button>
                                        </motion.div>
                                    </form>
                                </div>

                                {/* Footer note */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.1 }}
                                    className="text-center text-xs mt-5 flex items-center justify-center gap-2"
                                    style={{ color: "rgba(21,128,61,0.45)" }}
                                >
                                    <Leaf className="w-3.5 h-3.5" />
                                    Cuidando el planeta juntos
                                </motion.p>
                            </motion.div>
                        </div>
                    </div>
                </main>

                <Footer />

                <Toast message={toast.message} type={toast.type} onClose={closeToast} />
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                    title="¿Eliminar cuenta?"
                    message="¿Estás seguro de que deseas eliminar tu cuenta permanentemente? Esta acción no se puede deshacer y perderás todo tu progreso."
                    confirmText="Sí, eliminar"
                    cancelText="Mmm, mejor no"
                />
                <AnimatePresence>
                    {showOfensiveModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
                            onClick={() => setShowOfensiveModal(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85, y: 30 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                                        className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 shadow-lg"
                                    >
                                        <ShieldAlert className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-white">Lenguaje no permitido</h3>
                                    <p className="text-sm text-red-100 mt-1">Se detectó contenido inapropiado</p>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 mb-5">
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-red-800">Lenguaje ofensivo detectado</p>
                                            <p className="text-xs text-red-600 mt-1">
                                                El nombre o apellido ingresado contiene términos que no están permitidos
                                                en nuestra plataforma. Por favor, usa nombres apropiados.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowOfensiveModal(false)}
                                        className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-red-500/25 transition-all active:scale-[0.98]"
                                    >
                                        Entendido, corregir
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowOfensiveModal(false)}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}