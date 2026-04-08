import CarouselSlide from '../models/CarouselSlide.js';
import { v2 as cloudinary } from 'cloudinary';

// Obtener todos los slides (Público)
export const getActiveSlides = async (req, res) => {
    try {
        const slides = await CarouselSlide.find({ active: true }).sort({ order: 1 });
        res.json({
            success: true,
            slides
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener los slides activos',
            error: error.message
        });
    }
};

// Obtener todos los slides para admin (Admin)
export const getAllSlides = async (req, res) => {
    try {
        const slides = await CarouselSlide.find().sort({ order: 1 });
        res.json({
            success: true,
            slides
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener todos los slides',
            error: error.message
        });
    }
};

// Crear un nuevo slide (Admin)
export const createSlide = async (req, res) => {
    try {
        const { tag, title, subtitle, src, publicId, alt, active } = req.body;
        
        // Determinar el orden (al final)
        const count = await CarouselSlide.countDocuments();
        
        const newSlide = new CarouselSlide({
            tag,
            title,
            subtitle,
            src,
            publicId,
            alt: alt || title,
            active: active ?? true,
            order: count
        });

        await newSlide.save();
        res.status(201).json({
            success: true,
            mensaje: 'Slide creado correctamente',
            slide: newSlide
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al crear el slide',
            error: error.message
        });
    }
};

// Actualizar un slide (Admin)
export const updateSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const slide = await CarouselSlide.findByIdAndUpdate(id, updates, { new: true });

        if (!slide) {
            return res.status(404).json({
                success: false,
                mensaje: 'Slide no encontrado'
            });
        }

        res.json({
            success: true,
            mensaje: 'Slide actualizado correctamente',
            slide
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar el slide',
            error: error.message
        });
    }
};

// Eliminar un slide (Admin)
export const deleteSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const slide = await CarouselSlide.findByIdAndDelete(id);

        if (!slide) {
            return res.status(404).json({
                success: false,
                mensaje: 'Slide no encontrado'
            });
        }

        // Eliminar de Cloudinary si existe publicId
        if (slide.publicId) {
            try {
                await cloudinary.uploader.destroy(slide.publicId);
            } catch (cloudErr) {
                console.error('Error al eliminar imagen de Cloudinary:', cloudErr);
            }
        }

        res.json({
            success: true,
            mensaje: 'Slide eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar el slide',
            error: error.message
        });
    }
};

// Reordenar slides (Admin)
export const reorderSlides = async (req, res) => {
    try {
        const { slides } = req.body; // Array de objetos con { id, order } o simplemente array de IDs en orden

        if (!Array.isArray(slides)) {
            return res.status(400).json({
                success: false,
                mensaje: 'Se espera un array de slides'
            });
        }

        const bulkOps = slides.map((slideId, index) => ({
            updateOne: {
                filter: { _id: slideId },
                update: { $set: { order: index } }
            }
        }));

        await CarouselSlide.bulkWrite(bulkOps);

        res.json({
            success: true,
            mensaje: 'Slides reordenados correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al reordenar los slides',
            error: error.message
        });
    }
};
