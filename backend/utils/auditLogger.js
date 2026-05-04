import AuditLog from '../models/AuditLog.js';

/**
 * Crea un registro de auditoría y notifica a los administradores vía sockets
 * @param {Object} app - Instancia de express (req.app)
 * @param {Object} logData - Datos del log { type, action, details, user }
 */
export const createAuditLog = async (app, logData) => {
    try {
        const log = await AuditLog.create(logData);
        
        // Notificar a los admins vía socket para que refresquen su panel
        const io = app.get('io');
        if (io) {
            io.to('admins').emit('admin:audit_update', log);
            console.log('📢 Audit log emitido a admins');
        }
        
        return log;
    } catch (error) {
        console.error('❌ Error al crear AuditLog:', error);
    }
};
