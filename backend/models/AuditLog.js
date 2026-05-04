import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    type: {
        type: String, 
        required: true
    },
    action: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    user: {
        type: String,
        default: 'Sistema'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800 // Se borra automáticamente después de 7 días (604800 segundos)
    }
});

export default mongoose.model('AuditLog', auditLogSchema);
