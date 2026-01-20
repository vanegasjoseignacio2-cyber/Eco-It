import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Edit,
    LogOut,
    Sparkles,
    Leaf,
    TreePine,
    Award,
    Recycle,
    TreeDeciduous,
    Sprout,
    Trees,
    Mountain,
    TreePalm
} from "lucide-react";

export default function ProfileEcoIt() {
    const [userData, setUserData] = useState({
        nombre: "Cargando...",
        email: "correo@ejemplo.com",
        edad: "--",
        telefono: "--",
        avatar: "U"
    });

    useEffect(() => {
        // Simular carga de datos del usuario
        setTimeout(() => {
            setUserData({
                nombre: "Luisito",
                email: "Luisito@insano.com",
                edad: "34 años",
                telefono: "+57 300 123 4567",
                avatar: "34"
            });
        }, 500);
    }, []);

    const handleEdit = () => {
        console.log("Editar perfil");
        // Lógica para editar perfil
    };

    const handleLogout = () => {
        console.log("Cerrar sesión");
        // Lógica para cerrar sesión
    };

    return (
                <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
                
                            {/* Navbar */}
                            <Navbar />

        <main className="min-h-screen mt-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden py-12 px-4">

            {/* Hojas flotantes de fondo */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-green-600/10"
                        initial={{ y: "100vh", x: `${15 + i * 20}vw` }}
                        animate={{ y: "-10vh", rotate: 360 }}
                        transition={{
                            duration: 18 + i * 3,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 2,
                        }}
                    >
                        <TreePalm size={35 + i * 12} />
                    </motion.div>
                ))}
            </div>

            <div className="container mx-auto max-w-2xl relative z-10">

                {/* Título animado */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 text-center"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 mb-4 text-sm"
                    >
                        <Sparkles className="w-4 h-4" />
                        Tu Espacio Eco-It
                    </motion.span>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                        Mi <span className="text-green-600">Perfil</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Gestiona tu información personal
                    </p>
                </motion.div>

                {/* Tarjeta de Perfil */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-green-100"
                >

                    {/* Header con gradiente verde */}
                    <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 h-32 md:h-40 relative">
                        {/* Decoración de hojas en el header */}
                        <div className="absolute inset-0 opacity-20">
                            <TreePine className="absolute top-4 right-8 w-12 h-12 text-white" />
                            <Sprout className="absolute bottom-6 right-48 w-12 h-12 text-white" />
                            <Recycle className="absolute bottom-4 left-8 w-12 h-12 text-white" />
                            <TreeDeciduous className="absolute top-6 mx-48 w-12 h-12 text-white" />
                        </div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.5, stiffness: 200 }}
                            className="absolute inset-x-0 -bottom-10 sm:-bottom-12 flex justify-center"
                        >
                            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-white">
                                {userData.avatar}
                            </div>
                        </motion.div>
                    </div>

                    {/* Información del Usuario */}
                    <div className="pt-20 pb-8 px-6 md:px-8">

                        {/* Nombre y email */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-center mb-8"
                        >
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">
                                {userData.nombre}
                            </h3>
                            <div className="flex items-center justify-center gap-2 text-gray-600 text-lg">
                                <Mail className="w-5 h-5 text-green-600" />
                                {userData.email}
                            </div>
                        </motion.div>

                        {/* Badge de eco-guerrero */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex items-center justify-center gap-2 mb-8 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl"
                        >
                            <Award className="w-5 h-5 text-green-600" />
                            <span className="text-green-700 font-semibold">Luisito-34 Nivel 1</span>
                        </motion.div>

                        {/* Detalles adicionales */}
                        <div className="space-y-4 mb-8">

                            {/* Edad */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex items-center p-4 bg-gradient-to-r from-white to-green-50 rounded-xl border border-green-100 hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mr-4">
                                    <Calendar className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Edad</p>
                                    <p className="font-semibold text-gray-800 text-lg">{userData.edad}</p>
                                </div>
                            </motion.div>

                            {/* Teléfono */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 }}
                                className="flex items-center p-4 bg-gradient-to-r from-white to-green-50 rounded-xl border border-green-100 hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mr-4">
                                    <Phone className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Teléfono</p>
                                    <p className="font-semibold text-gray-800 text-lg">{userData.telefono}</p>
                                </div>
                            </motion.div>

                            {/* Estadísticas eco */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                                className="flex items-center p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-200"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                                    <Trees className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 font-medium">Impacto Ambiental</p>
                                    <p className="font-bold text-green-700 text-lg">Equivale a sembrar 5 árboles</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Botones de acción */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                            className="space-y-3"
                        >
                            {/* Botón editar */}
                            
                            <motion.a
                                href="/editarperfil"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleEdit}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <Edit className="w-5 h-5" />
                                Editar perfil
                            </motion.a>

                            {/* Botón cerrar sesión */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-5 h-5" />
                                Cerrar Sesión
                            </motion.button>
                        </motion.div>

                        {/* Info adicional */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="text-center mt-6 text-sm text-gray-500"
                        >
                            Miembro desde Enero 2025 
                        </motion.p>
                    </div>
                </motion.div>

                {/* Tarjetas de logros */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    {[
                        { icon: Leaf, label: "Reciclajes", value: "127" },
                        { icon: Award, label: "Logros", value: "12" },
                        { icon: TreePine, label: "Puntos", value: "450" }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.4 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-100 text-center"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <stat.icon className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-700 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </main>
        <Footer/>
                    </div>

    );
}