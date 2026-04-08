import PuntoReciclaje from "../models/puntoReciclaje.js";

// Obtener todos los puntos
export const obtenerPuntos = async (req, res) => {
    try {
        const puntos = await PuntoReciclaje.find().sort({ createdAt: -1 });
        res.json({ success: true, puntos });
    } catch (error) {
        console.error("Error al obtener puntos:", error);
        res.status(500).json({ success: false, mensaje: error.message });
    }
};

// Crear un punto
export const crearPunto = async (req, res) => {
    try {
        const { nombre, tipo, lat, lng, descripcion, activo } = req.body;
        const nuevoPunto = new PuntoReciclaje({ nombre, tipo, lat, lng, descripcion, activo });
        await nuevoPunto.save();
        res.status(201).json({ success: true, punto: nuevoPunto });
    } catch (error) {
        console.error("Error al crear punto:", error);
        res.status(500).json({ success: false, mensaje: error.message });
    }
};

// Actualizar un punto
export const actualizarPunto = async (req, res) => {
    try {
        const { id } = req.params;
        const puntoActualizado = await PuntoReciclaje.findByIdAndUpdate(id, req.body, { new: true });
        if (!puntoActualizado) {
            return res.status(404).json({ success: false, mensaje: "Punto no encontrado" });
        }
        res.json({ success: true, punto: puntoActualizado });
    } catch (error) {
        console.error("Error al actualizar punto:", error);
        res.status(500).json({ success: false, mensaje: error.message });
    }
};

// Eliminar un punto
export const eliminarPunto = async (req, res) => {
    try {
        const { id } = req.params;
        const puntoEliminado = await PuntoReciclaje.findByIdAndDelete(id);
        if (!puntoEliminado) {
            return res.status(404).json({ success: false, mensaje: "Punto no encontrado" });
        }
        res.json({ success: true, mensaje: "Punto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar punto:", error);
        res.status(500).json({ success: false, mensaje: error.message });
    }
};

// Alternar estado activo
export const toggleActivoPunto = async (req, res) => {
    try {
        const { id } = req.params;
        const punto = await PuntoReciclaje.findById(id);
        if (!punto) {
            return res.status(404).json({ success: false, mensaje: "Punto no encontrado" });
        }
        punto.activo = !punto.activo;
        await punto.save();
        res.json({ success: true, punto });
    } catch (error) {
        console.error("Error al alternar estado del punto:", error);
        res.status(500).json({ success: false, mensaje: error.message });
    }
};
