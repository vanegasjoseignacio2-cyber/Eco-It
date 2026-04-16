import User from "../models/user.js";
import Chat from "../models/chat.js";
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

        await usuario.save();

        // Notificar a otros administradores en tiempo real
        const io = req.app.get("io");
        if (io) {
            io.to("admins").emit("admin:usuario_baneado", {
                email: usuario.email,
                nombre: `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim(),
                adminName: req.usuario.nombre,
                dias: diasDelBaneo,
                fecha: new Date(),
                mensaje: `El usuario ${usuario.email} ha sido baneado por ${diasDelBaneo} días.`
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
        const usuarios = await User.find().lean();
        const totalUsuarios = usuarios.length;

        // Fecha de hoy (inicio del día)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const añoActual = hoy.getFullYear();

        let consultasHoy = 0;
        let nuevosHoy = 0;
            let totalPuntos = 0;
        let totalConsultas = 0;

        // Variables de gráficos y picos
        const registroPorMes = Array(12).fill(0);   // registros (createdAt)
        const activosPorMes  = Array(12).fill(0);   // usuarios activos (ultimaConexion)
        const consultasPorMes = Array(12).fill(0);  // consultas IA (historialConsultas)
        const registroPorDia = {};

        usuarios.forEach(user => {
            // ── Registros ──────────────────────────────────────────────────
            if (user.createdAt) {
                const createdAt = new Date(user.createdAt);
                if (createdAt >= hoy) nuevosHoy++;
                const mes = createdAt.getMonth();
                registroPorMes[mes]++;
                const fechaStr = createdAt.toISOString().split('T')[0];
                registroPorDia[fechaStr] = (registroPorDia[fechaStr] || 0) + 1;
            }

            // ── Usuarios activos por mes (ultimaConexion) ──────────────────
            if (user.ultimaConexion) {
                const uc = new Date(user.ultimaConexion);
                // Solo contar el año actual para que el gráfico sea del año en curso
                if (uc.getFullYear() === añoActual) {
                    activosPorMes[uc.getMonth()]++;
                }
            }

            // ── Puntos Reciclaje ──────────────────────────────────────────
            totalPuntos += (user.puntos || 0);

            // Ya no tenemos user.historialConsultas, lo sumaremos luego.
        });

        // ── Consultas IA desde la colección Chat ───────────────────────
        const todosLosChats = await Chat.find().lean();
        todosLosChats.forEach(chat => {
            if (chat.mensajes && chat.mensajes.length > 0) {
                chat.mensajes.forEach(msg => {
                    if (msg.role === 'user') {
                        // Omitir mensajes de metadatos o creación sin contenido explícito
                        if(msg.content && !msg.content.includes("Imagen enviada para análisis de datos")) {
                            totalConsultas++;
                            const fechaConsulta = new Date(msg.fecha || chat.updatedAt || chat.createdAt);
                            
                            if (fechaConsulta >= hoy) {
                                consultasHoy++;
                            }
                            if (fechaConsulta.getFullYear() === añoActual) {
                                consultasPorMes[fechaConsulta.getMonth()]++;
                            }
                        }
                    }
                });
            }
        });

        const maxDiario = Object.values(registroPorDia).length > 0 ? Math.max(...Object.values(registroPorDia)) : 0;

        const mesesLabel = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
        let maxMesInt = 0;
        if (Math.max(...registroPorMes) > 0) {
            maxMesInt = registroPorMes.indexOf(Math.max(...registroPorMes));
        }
        const mejorMes = totalUsuarios > 0 && Math.max(...registroPorMes) > 0 ? mesesLabel[maxMesInt] : '—';

        // ── Datos diarios para los últimos 30 días ─────────────────────
        const hace30dias = new Date();
        hace30dias.setDate(hace30dias.getDate() - 30);
        hace30dias.setHours(0, 0, 0, 0);

        const hace7dias = new Date();
        hace7dias.setDate(hace7dias.getDate() - 7);
        hace7dias.setHours(0, 0, 0, 0);

        // Generar etiquetas de días para los últimos 30 días
        const diasLabels30 = [];
        const diasLabels7 = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            const label = `${d.getDate()}/${d.getMonth() + 1}`;
            diasLabels30.push({ key, label });
            if (i < 7) diasLabels7.push({ key, label });
        }

        // Agrupar registros de usuarios por día
        const usuariosPorDia = {};
        usuarios.forEach(user => {
            if (user.createdAt) {
                const fechaStr = new Date(user.createdAt).toISOString().split('T')[0];
                usuariosPorDia[fechaStr] = (usuariosPorDia[fechaStr] || 0) + 1;
            }
        });

        // Agrupar consultas por día
        const consultasPorDia = {};
        todosLosChats.forEach(chat => {
            if (chat.mensajes && chat.mensajes.length > 0) {
                chat.mensajes.forEach(msg => {
                    if (msg.role === 'user' && msg.content && !msg.content.includes("Imagen enviada para análisis de datos")) {
                        const fecha = new Date(msg.fecha || chat.updatedAt || chat.createdAt);
                        const fechaStr = fecha.toISOString().split('T')[0];
                        consultasPorDia[fechaStr] = (consultasPorDia[fechaStr] || 0) + 1;
                    }
                });
            }
        });

        // Estructura Chart Data
        const chartData = {
            // Datos anuales (por mes)
            users: mesesLabel.map((m, i) => ({ label: m, value: activosPorMes[i] })),
            queries: mesesLabel.map((m, i) => ({ label: m, value: consultasPorMes[i] })),
            // Datos mensuales (por día, últimos 30 días)
            usersMonth: diasLabels30.map(d => ({ label: d.label, value: usuariosPorDia[d.key] || 0 })),
            queriesMonth: diasLabels30.map(d => ({ label: d.label, value: consultasPorDia[d.key] || 0 })),
            // Datos semanales (por día, últimos 7 días)
            usersWeek: diasLabels7.map(d => ({ label: d.label, value: usuariosPorDia[d.key] || 0 })),
            queriesWeek: diasLabels7.map(d => ({ label: d.label, value: consultasPorDia[d.key] || 0 })),
        };

        res.json({
            success: true,
            totalUsuarios,
            usuariosOnline: usuariosConectados.size,
            consultasHoy,
            mejorMes,
            picoDiario: maxDiario,
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

