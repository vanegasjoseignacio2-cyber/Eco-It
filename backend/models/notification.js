import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: true,
        enum: ['alerta_obscena', 'usuario_baneado']
    },
    email: { type: String },
    nombre: { type: String },
    adminName: { type: String },
    dias: { type: Number },
    mensaje: { type: String },
    fecha: { type: Date, default: Date.now },
    readBy: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
}, { 
    timestamps: true 
});

// Índice TTL para auto-eliminar a los 7 días (604800 segundos)
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

export default mongoose.model('Notification', notificationSchema);
