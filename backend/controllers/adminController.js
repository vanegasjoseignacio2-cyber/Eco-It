import User from "../models/user.js";
import Chat from "../models/chat.js";
import Notification from "../models/notification.js";
import AuditLog from "../models/AuditLog.js";
import { createAuditLog } from "../utils/auditLogger.js";
import { usuariosConectados } from "../index.js";

export const cambiarRolUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        if (req.usuario.id === id) {
            return res.status(400).json({ success: false, mensaje: "No puedes cambiar tu propio rol" });
        }

        if (rol === "superadmin") {
            return res.status(400).json({ success: false, mensaje: "No tienes permisos para crear otro superadmin" });
        }

        if (!['user', 'admin'].includes(rol)) {
            return res.status(400).json({ success: false, mensaje: "Rol inválido" });
        }

        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(404).json({ success: false, mensaje: "Usuario no encontrado" });
        }
        
        // Evitar modificar a otro superadmin
        if (usuario.rol === "superadmin") {
            return res.status(403).json({ success: false, mensaje: "No puedes modificar a otro superadmin" });
        }

        usuario.rol = rol;
        await usuario.save();

        // Audit log
        await createAuditLog(req.app, {
            type: 'role_change',
            action: 'Cambio de Rol',
            details: `Rol de ${usuario.email} cambiado a "${rol}"`,
            user: req.usuario.nombre || req.usuario.email
        });

        // Actualizar salas de socket en tiempo real
        const io = req.app.get("io");
        if (io && usuariosConectados.has(id)) {
            const data = usuariosConectados.get(id);
            data.sockets.forEach(socketId => {
                const s = io.sockets.sockets.get(socketId);
                if (s) {
                    if (rol === 'admin') {
                        s.join('admins');
                        console.log(`Socket ${socketId} unido dinámicamente a 'admins'`);
                    } else {
                        s.leave('admins');
                        console.log(`Socket ${socketId} removido dinámicamente de 'admins'`);
                    }
                }
            });
        }

        res.status(200).json({ success: true, mensaje: `El rol del usuario ha sido cambiado a ${rol}`, usuario });
    } catch (error) {
        console.error("Error al cambiar rol:", error);
        res.status(500).json({ success: false, mensaje: "Error en el servidor al cambiar rol" });
    }
};

export const banearUsuarioAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const diasDelBaneo = req.body.dias || 7;
        const motivo = req.body.motivo || "Incumplimiento de las normas";

        if (req.usuario.id === id) {
            return res.status(400).json({ success: false, message: "No puedes banearte a ti mismo" });
        }

        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        usuario.status = 'banned';
        const banHasta = new Date();
        banHasta.setDate(banHasta.getDate() + diasDelBaneo);
        usuario.banHasta = banHasta;
        usuario.banReason = motivo;

        await usuario.save();

        // Audit log
        await createAuditLog(req.app, {
            type: 'ban',
            action: 'Usuario Baneado',
            details: `${usuario.email} baneado por ${diasDelBaneo} días. Motivo: ${motivo}`,
            user: req.usuario.nombre || req.usuario.email
        });

        const notificacionData = {
            type: "usuario_baneado",
            email: usuario.email,
            nombre: `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim(),
            adminName: req.usuario.nombre,
            dias: diasDelBaneo,
            fecha: new Date(),
            mensaje: `El usuario ${usuario.email} ha sido baneado por ${diasDelBaneo} días. Motivo: ${motivo}`
        };

        const notificacion = await Notification.create(notificacionData);

        // Notificar a otros administradores en tiempo real
        const io = req.app.get("io");
        if (io) {
            io.to("admins").emit("admin:usuario_baneado", {
                ...notificacionData,
                id: notificacion._id
            });
        }

        res.status(200).json({ success: true, message: `Usuario baneado por ${diasDelBaneo} días`, usuario });
    } catch (error) {
        console.error("Error al banear usuario:", error);
        res.status(500).json({ success: false, message: "Error en el servidor al banear usuario" });
    }
};

export const desbanearUsuarioAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        usuario.status = 'active';
        usuario.banHasta = null;

        await usuario.save();

        // Audit log
        await createAuditLog(req.app, {
            type: 'unban',
            action: 'Usuario Desbaneado',
            details: `${usuario.email} ha sido desbaneado`,
            user: req.usuario.nombre || req.usuario.email
        });

        res.status(200).json({ success: true, message: "Usuario desbaneado exitosamente", usuario });
    } catch (error) {
        console.error("Error al desbanear usuario:", error);
        res.status(500).json({ success: false, message: "Error en el servidor al desbanear usuario" });
    }
};

export const eliminarUsuarioAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.usuario.id === id) {
            return res.status(400).json({
                success: false,
                message: "No puedes eliminarte a ti mismo"
            });
        }

        const usuarioEliminado = await User.findByIdAndDelete(id);;

        if (!usuarioEliminado) {
            return res.status(400).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        // Audit log
        await createAuditLog(req.app, {
            type: 'delete',
            action: 'Usuario Eliminado',
            details: `Cuenta eliminada: ${usuarioEliminado.email}`,
            user: req.usuario.nombre || req.usuario.email
        });

        res.status(200).json({
            success: true,
            message: "Usuario eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error al eliminar usuario(Admin)", error);
        res.status(500).json({
            success: false,
            message: "Error en el servidor al eliminar usuario"
        });
    }
};

export const obtenerUsuarios = async (req, res) => {
    try {
        const usuariosDocs = await User.find()
            .select('-password -resetPasswordToken -resetPasswordExpires')
            .sort({ createdAt: -1 });

        const usuarios = usuariosDocs.map(user => {
            const userObj = user.toObject();
            userObj.isOnline = usuariosConectados.has(user._id.toString());
            return userObj;
        });

        res.json({ success: true, usuarios });
    } catch (error) {
        res.json({ success: false, mensaje: error.message });
    }
};

export const obtenerStats = async (req, res) => {
    try {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const añoActual = hoy.getFullYear();

        // 1. Ejecutar consultas básicas en paralelo para KPI Cards
        const [
            totalUsuarios,
            puntosResult,
            nuevosHoy,
            chatStats
        ] = await Promise.all([
            User.countDocuments(),
            User.aggregate([
                { $group: { _id: null, totalPuntos: { $sum: "$puntos" } } }
            ]),
            User.countDocuments({ createdAt: { $gte: hoy } }),
            Chat.aggregate([
                { $project: {
                    userMessages: {
                      $filter: {
                        input: "$mensajes",
                        as: "msg",
                        cond: { 
                          $and: [
                            { $eq: ["$$msg.role", "user"] },
                            { $not: { $regexMatch: { input: "$$msg.content", regex: "Imagen enviada para análisis de datos" } } }
                          ]
                        }
                      }
                    },
                    fechaUltima: { $max: "$mensajes.fecha" }
                }},
                { $project: {
                    count: { $size: "$userMessages" },
                    hoyCount: { 
                      $size: {
                        $filter: {
                          input: "$userMessages",
                          as: "um",
                          cond: { $gte: ["$$um.fecha", hoy] }
                        }
                      }
                    },
                    meses: {
                        $map: {
                            input: "$userMessages",
                            as: "m",
                            in: {
                                $cond: [
                                    { $eq: [{ $year: "$$m.fecha" }, añoActual] },
                                    { $month: "$$m.fecha" },
                                    null
                                ]
                            }
                        }
                    }
                }},
                { $group: {
                    _id: null,
                    totalConsultas: { $sum: "$count" },
                    consultasHoy: { $sum: "$hoyCount" },
                    allMeses: { $push: "$meses" }
                }}
            ])
        ]);

        const totalPuntos = puntosResult[0]?.totalPuntos || 0;
        const totalConsultas = chatStats[0]?.totalConsultas || 0;
        const consultasHoy = chatStats[0]?.consultasHoy || 0;

        // 2. Obtener datos para gráficos (Últimos 30 días) en paralelo
        const hace30dias = new Date();
        hace30dias.setDate(hace30dias.getDate() - 30);
        hace30dias.setHours(0, 0, 0, 0);

        const [userRegistros, chatRegistros] = await Promise.all([
            User.aggregate([
                { $match: { createdAt: { $gte: hace30dias } } },
                { $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }}
            ]),
            Chat.aggregate([
                { $unwind: "$mensajes" },
                { $match: { 
                    "mensajes.role": "user",
                    "mensajes.fecha": { $gte: hace30dias },
                    "mensajes.content": { $not: /Imagen enviada para análisis de datos/ }
                }},
                { $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$mensajes.fecha" } },
                    count: { $sum: 1 }
                }}
            ])
        ]);

        // 3. Formatear datos para el frontend
        const mesesLabel = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
        const consultasPorMes = Array(12).fill(0);
        if (chatStats[0]?.allMeses) {
            chatStats[0].allMeses.flat().forEach(m => {
                if (m !== null) consultasPorMes[m - 1]++;
            });
        }

        const diasLabels30 = [];
        const usuariosPorDia = {};
        const consultasPorDia = {};

        userRegistros.forEach(r => usuariosPorDia[r._id] = r.count);
        chatRegistros.forEach(r => consultasPorDia[r._id] = r.count);

        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            const label = `${d.getDate()}/${d.getMonth() + 1}`;
            diasLabels30.push({ key, label });
        }

        const chartData = {
            users: mesesLabel.map((m, i) => ({ label: m, value: 0 })), // Opcional: implementar activos por mes
            queries: mesesLabel.map((m, i) => ({ label: m, value: consultasPorMes[i] })),
            usersMonth: diasLabels30.map(d => ({ label: d.label, value: usuariosPorDia[d.key] || 0 })),
            queriesMonth: diasLabels30.map(d => ({ label: d.label, value: consultasPorDia[d.key] || 0 })),
            usersWeek: diasLabels30.slice(23).map(d => ({ label: d.label, value: usuariosPorDia[d.key] || 0 })),
            queriesWeek: diasLabels30.slice(23).map(d => ({ label: d.label, value: consultasPorDia[d.key] || 0 })),
        };

        res.json({
            success: true,
            totalUsuarios,
            usuariosOnline: usuariosConectados.size,
            consultasHoy,
            mejorMes: '—',
            picoDiario: 0,
            nuevosHoy,
            totalPuntos,
            totalConsultas,
            chartData
        });

    } catch (error) {
        console.error("Error en obtenerStats:", error);
        res.json({ success: false, mensaje: error.message });
    }
};

export const obtenerDatosAdmin = (req, res) => {
    res.json({ 
        message: 'Bienvenido al panel de administrador',
        admin: {
            nombre: req.usuario.nombre,
            email: req.usuario.email,
            rol: req.usuario.rol
        }
    });
};

export const obtenerNotificaciones = async (req, res) => {
    try {
        const notificationsDocs = await Notification.find().sort({ fecha: -1 }).limit(50);
        
        const notifications = notificationsDocs.map(notif => {
            const obj = notif.toObject();
            obj.id = obj._id;
            obj.read = obj.readBy.some(id => id.toString() === req.usuario._id.toString() || id.toString() === req.usuario.id.toString());
            return obj;
        });

        res.json({ success: true, notifications });
    } catch (error) {
        console.error("Error al obtener notificaciones:", error);
        res.status(500).json({ success: false, mensaje: "Error al obtener notificaciones" });
    }
};

export const marcarNotificacionesLeidas = async (req, res) => {
    try {
        const userId = req.usuario._id || req.usuario.id;
        
        // Agregar el admin a readBy si no está incluido
        await Notification.updateMany(
            { readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
        );

        res.json({ success: true, mensaje: "Notificaciones marcadas como leídas" });
    } catch (error) {
        console.error("Error al marcar notificaciones:", error);
        res.status(500).json({ success: false, mensaje: "Error al marcar notificaciones como leídas" });
    }
};

export const eliminarNotificacion = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndDelete(id);
        res.json({ success: true, mensaje: "Notificación eliminada de la base de datos" });
    } catch (error) {
        console.error("Error al eliminar notificación:", error);
        res.status(500).json({ success: false, mensaje: "Error al eliminar la notificación" });
    }
};

export const eliminarTodasNotificaciones = async (req, res) => {
    try {
        await Notification.deleteMany({});
        res.json({ success: true, mensaje: "Todas las notificaciones eliminadas de la base de datos" });
    } catch (error) {
        console.error("Error al eliminar todas las notificaciones:", error);
        res.status(500).json({ success: false, mensaje: "Error al eliminar las notificaciones" });
    }
};

export const obtenerAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50);
        res.json({ success: true, logs });
    } catch (error) {
        console.error("Error al obtener auditoría:", error);
        res.status(500).json({ success: false, mensaje: "Error al obtener registros de auditoría" });
    }
};

export const eliminarAuditLog = async (req, res) => {
    try {
        const { id } = req.params;
        await AuditLog.findByIdAndDelete(id);
        res.json({ success: true, mensaje: "Registro eliminado de la base de datos" });
    } catch (error) {
        console.error("Error al eliminar audit log:", error);
        res.status(500).json({ success: false, mensaje: "Error al eliminar el registro" });
    }
};

export const eliminarTodosAuditLogs = async (req, res) => {
    try {
        await AuditLog.deleteMany({});
        res.json({ success: true, mensaje: "Todos los registros eliminados de la base de datos" });
    } catch (error) {
        console.error("Error al eliminar todos los audit logs:", error);
        res.status(500).json({ success: false, mensaje: "Error al eliminar los registros" });
    }
};
