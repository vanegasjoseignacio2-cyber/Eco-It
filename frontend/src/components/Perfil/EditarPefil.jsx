import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import Toast from "../ui/Toast";
import ConfirmationModal from "../ui/ConfirmationModal";
import { useAuth } from "../../context/authContext";
import { actualizarPerfil } from "../../services/api";
import {
    Mail,
    User,
    Calendar,
    Phone,
    Save,
    X,
    Trash2,
    Leaf,
} from "lucide-react";
export default function EditProfile() {
    const { usuario, token, actualizarUsuario } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        nombre: "",
        apellido: "",
        edad: "",
        telefono: "",
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "" });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    useEffect(() => {
        if (usuario) {
            setFormData({
                email: usuario.email || "",
                nombre: usuario.nombre || "",
                apellido: usuario.apellido || "",
                edad: usuario.edad || "",
                telefono: usuario.telefono || "",
            });
        }
    }, [usuario]);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };
    const closeToast = () => {
        setToast({ message: "", type: "" });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const respuesta = await actualizarPerfil(token, formData);
            if (respuesta.success) {
                // Actualizar contexto
                actualizarUsuario({ ...usuario, ...formData });
                showToast("Cambios guardados exitosamente!", "success");
                // Esperar un momento para que el usuario vea el toast antes de redirigir
                setTimeout(() => {
                    navigate("/perfil");
                }, 1500);
            }
        } catch (error) {
            console.error("Error actualizando perfil:", error);
            showToast("Error al guardar cambios: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        console.log("Cancelando edición");
        window.history.back();
    };
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        console.log("Eliminando cuenta");
        // Aquí iría la lógica real de eliminación (llamada a API)
        showToast("Cuenta eliminada (simulación)", "info");
    };
    // Get initials for avatar
    const getInitials = () => {
        if (formData.nombre && formData.apellido) {
            return `${formData.nombre.charAt(0)}${formData.apellido.charAt(0)}`.toUpperCase();
        }
        if (formData.nombre) return formData.nombre.charAt(0).toUpperCase();
        if (formData.email && formData.email.length > 0) return formData.email.charAt(0).toUpperCase();
        return "?";
    };
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            <div className="mb-20">
                {/* Navbar */}
                <Navbar />
            </div>
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4 sm:py-12 relative overflow-hidden">
                <div className="relative  z-10 max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 mb-4"
                        >
                            <Leaf className="w-4 h-4" />
                            Perfil Eco-It
                        </motion.div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
                            Editar Mi Perfil
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Actualiza tu información personal
                        </p>
                    </motion.div>
                    {/* Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-visible"
                    >
                        <div className="relative">
                            {/* Header */}
                            <div className=" h-32 sm:h-40 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 overflow-hidden rounded-t-3xl">
                                {/* Animated pattern overlay */}
                                <motion.div
                                    className="absolute inset-0 opacity-20"
                                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    style={{
                                        backgroundImage: "radial-gradient(circle, white 2px, transparent 2px)",
                                        backgroundSize: "30px 30px",
                                    }}
                                />
                                {/* Avatar centrado correctamente */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                                    className="absolute -bottom-14 sm:-bottom-16 inset-x-0 flex justify-center z-30"
                                >
                                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-2xl border-4 border-white">
                                        {getInitials()}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                        {/* Form */}
                        <div className=" z-0 sm:pt-24 pb-20 px-4 sm:px-8">
                            <div className="max-w-2xl mx-auto space-y-6">
                                {/* Email (readonly) */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <Mail className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            readOnly
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed transition-all"
                                        />
                                    </div>
                                </motion.div>
                                {/* Name and Lastname grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Nombre */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nombre
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                                <User className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300"
                                                placeholder="Ingresa tu nombre"
                                            />
                                        </div>
                                    </motion.div>
                                    {/* Apellido */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Apellido
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                                <User className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <input
                                                type="text"
                                                name="apellido"
                                                value={formData.apellido}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300"
                                                placeholder="Ingresa tu apellido"
                                            />
                                        </div>
                                    </motion.div>
                                    {/* Edad */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Edad
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                                <Calendar className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <input
                                                type="number"
                                                name="edad"
                                                value={formData.edad}
                                                onChange={handleChange}
                                                min="1"
                                                max="120"
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300"
                                                placeholder="Ingresa tu edad"
                                            />
                                        </div>
                                    </motion.div>
                                    {/* Teléfono */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Teléfono
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                                <Phone className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300"
                                                placeholder="Ingresa tu teléfono"
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                                {/* Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                    className="space-y-3 pt-4"
                                >
                                    {/* Save and Cancel buttons */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <motion.button
                                            onClick={handleSubmit}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-5 h-5" />
                                            Guardar Cambios
                                        </motion.button>
                                        <motion.button
                                            onClick={handleCancel}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <X className="w-5 h-5" />
                                            Cancelar
                                        </motion.button>
                                    </div>
                                    {/* Delete button */}
                                    <motion.button
                                        onClick={handleDeleteClick}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        Eliminar la cuenta
                                    </motion.button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer note */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="text-center text-gray-600 mt-6 flex items-center justify-center gap-2"
                    >
                        <Leaf className="w-4 h-4 text-green-600" />
                        Cuidando el planeta juntos
                    </motion.p>
                </div>
            </div>
            <Footer />
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                title="¿Eliminar cuenta?"
                message="¿Estás seguro de que deseas eliminar tu cuenta permanentemente? Esta acción no se puede deshacer y perderás todo tu progreso."
                confirmText="Sí, eliminar"
                cancelText="Mmm, mejor no"
            />
        </div>
    );
}