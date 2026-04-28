import mongoose from 'mongoose';

/**
 * PendingRegistration
 * ────────────────────
 * Almacena datos del registro temporalmente hasta que el usuario
 * verifique su correo. Se elimina automáticamente al expirar (TTL index).
 */
const pendingRegistrationSchema = new mongoose.Schema({
    nombre:    { type: String, required: true },
    apellido:  { type: String, required: true },
    edad:      { type: Number, required: true },
    email:     { type: String, required: true, unique: true },
    telefono:  { type: String, required: true },
    password:  { type: String, required: true }, // ya hasheada

    codigo:    { type: String, required: true },
    expira:    { type: Date,   required: true },

    intentos:  { type: Number, default: 0 },     // max 5 intentos
    creadoEn:  { type: Date,   default: Date.now },
});

// TTL: MongoDB elimina el documento automáticamente cuando expira
pendingRegistrationSchema.index({ expira: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('PendingRegistration', pendingRegistrationSchema);