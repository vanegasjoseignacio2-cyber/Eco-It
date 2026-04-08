import PuntoReciclaje from "../models/puntoReciclaje.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const obtenerPuntosPublic = async (req, res) => {
  try {
    const puntos = await PuntoReciclaje.find({
      activo: true,
      visibleToUser: true
    }).sort({ createdAt: -1 });
    // Procesar puntos para mostrar en el mapa
    const puntosProcesados = puntos.map(p => ({
      id: p.id,
      nombre: p.nombre,
      tipo: p.tipo,
      lat: p.lat,
      lng: p.lng,
      imagen: p.imagen,
      descripcion: p.descripcion
    }));
    res.json({
      success: true,
      puntos: puntosProcesados
    });
  } catch (error) {
    console.error("Error al obtener puntos públicos:", error);
    res.status(500).json({
      success: false,
      mensaje: error.message
    });
  }
};


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
        const { nombre, tipo, lat, lng, descripcion, activo, imagen, visibleToUser } = req.body;
        let imageUrl = "";

        if (imagen) {
            const uploadRes = await cloudinary.uploader.upload(imagen, {
                folder: "ecoit_map_points",
            });
            imageUrl = uploadRes.secure_url;
        }

        const nuevoPunto = new PuntoReciclaje({ nombre, tipo, lat, lng, descripcion, activo, imagen: imageUrl, visibleToUser });
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
        const updateData = { ...req.body };

        if (updateData.imagen && updateData.imagen.startsWith("data:image")) {
            const uploadRes = await cloudinary.uploader.upload(updateData.imagen, {
                folder: "ecoit_map_points",
            });
            updateData.imagen = uploadRes.secure_url;
        }

        const puntoActualizado = await PuntoReciclaje.findByIdAndUpdate(id, updateData, { new: true });
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
