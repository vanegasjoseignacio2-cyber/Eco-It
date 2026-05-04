import mongoose from 'mongoose';
import AuditLog from './models/AuditLog.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Conectado. Creando log de prueba...");
    await AuditLog.create({
        type: 'system',
        action: 'Actualización del Sistema',
        details: 'Módulo de auditoría activado exitosamente.',
        user: 'Administrador'
    });
    console.log("Log creado.");
    process.exit(0);
}).catch(console.error);
