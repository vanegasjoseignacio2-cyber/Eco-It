import User from '../models/user.js';
import Season from '../models/Season.js';
import Mission from '../models/mission.js';

// Las misiones (logros) ahora son 100% dinámicas y se gestionan desde el panel de administración,
// guardándose en la colección `Mission`. Ya no hay logros "hardcodeados" en el código.

// ─── Helper: obtener o crear temporada activa ─────────────────────────────────
export const obtenerOCrearTemporada = async () => {
    let temporada = await Season.findOne({ activa: true }).sort({ createdAt: -1 });
    if (!temporada) {
        const count = await Season.countDocuments();
        const inicio = new Date();
        const fin = new Date(inicio);
        fin.setDate(fin.getDate() + 90); // 3 meses exactos

        const nombres = [
            'Primavera Verde', 'Verano Sostenible', 'Otoño Consciente', 'Invierno Ecológico'
        ];
        const nombreIdx = count % 4;

        temporada = await Season.create({
            numero: count + 1,
            nombre: `Temporada ${count + 1} — ${nombres[nombreIdx]}`,
            inicio,
            fin,
            activa: true
        });
        console.log(`✅ Temporada ${temporada.numero} creada: ${temporada.nombre}`);
    }
    return temporada;
};

// ─── Guardar puntaje de partida ───────────────────────────────────────────────
export const guardarPuntaje = async (req, res) => {
    try {
        const { puntos = 0, residuosRecolectados = 0, errores = 0, rachaMaxima = 0, tiempoJugado = 0 } = req.body;
        const userId = req.usuario.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });

        const temporada = await obtenerOCrearTemporada();

        // ─── Verificación de Temporada y Reinicio ────────────────────────────────
        if (!user.estadisticasJuego) {
            user.estadisticasJuego = {};
        }
        
        if (String(user.estadisticasJuego.temporadaId) !== String(temporada._id)) {
            // Reiniciar estadísticas y logros porque es una nueva temporada
            user.estadisticasJuego = {
                residuosRecolectados: 0,
                rachaMaxima: 0,
                partidasJugadas: 0,
                diasConsecutivos: 0,
                ultimaPartida: null,
                partidasPerfectas: 0,
                erroresCometidos: 0,
                tiempoTotalJugado: 0,
                temporadaId: temporada._id
            };
            user.logros = []; // Se reinician las misiones para la nueva temporada
            user.puntosJuego = 0; // Puntos de la temporada actual reiniciados
        }

        // Actualizar estadísticas del juego
        const stats = user.estadisticasJuego;
        stats.residuosRecolectados += residuosRecolectados;
        stats.erroresCometidos += errores;
        stats.rachaMaxima = Math.max(stats.rachaMaxima, rachaMaxima);
        stats.partidasJugadas += 1;
        stats.tiempoTotalJugado += tiempoJugado;

        // Verificar partida perfecta (0 errores y al menos 5 residuos)
        if (errores === 0 && residuosRecolectados >= 5) {
            stats.partidasPerfectas += 1;
        }

        // Calcular días consecutivos
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (stats.ultimaPartida) {
            const ayer = new Date(hoy);
            ayer.setDate(ayer.getDate() - 1);
            const ultimaFecha = new Date(stats.ultimaPartida);
            ultimaFecha.setHours(0, 0, 0, 0);

            if (ultimaFecha.getTime() === ayer.getTime()) {
                stats.diasConsecutivos += 1;
            } else if (ultimaFecha.getTime() < ayer.getTime()) {
                stats.diasConsecutivos = 1; // racha rota
            }
        } else {
            stats.diasConsecutivos = 1;
        }
        stats.ultimaPartida = new Date();

        // Actualizar puntos de la temporada
        user.puntosJuego += puntos;
        user.puntosJuegoHistorico += puntos;
        user.estadisticasJuego = stats;

        // ─── Verificar misiones / logros dinámicos ───────────────────────────────
        const logrosActuales = (user.logros || []).map(l => l.achievementId);
        const nuevosLogros = [];

        // Obtener ranking actual para verificar logro top_10
        const rankingData = await User.find({ puntosJuego: { $gt: 0 } })
            .sort({ puntosJuego: -1 })
            .select('_id')
            .limit(10)
            .lean();
        const posicionActual = rankingData.findIndex(u => u._id.toString() === userId) + 1;
        const rankActual = posicionActual > 0 ? posicionActual : null;

        // Buscar misiones activas en DB
        const misionesActivas = await Mission.find({ active: true });

        for (const mission of misionesActivas) {
            const missionId = mission._id.toString();
            if (logrosActuales.includes(missionId)) continue; // ya completada

            // Evaluar condición dinámica
            let completada = false;
            if (mission.targetMetric === 'residuosRecolectados' && stats.residuosRecolectados >= mission.targetValue) completada = true;
            if (mission.targetMetric === 'rachaMaxima' && stats.rachaMaxima >= mission.targetValue) completada = true;
            if (mission.targetMetric === 'partidasJugadas' && stats.partidasJugadas >= mission.targetValue) completada = true;
            if (mission.targetMetric === 'puntosTemporada' && user.puntosJuego >= mission.targetValue) completada = true;
            if (mission.targetMetric === 'puntosPartida' && puntos >= mission.targetValue) completada = true;
            if (mission.targetMetric === 'partidasPerfectas' && stats.partidasPerfectas >= mission.targetValue) completada = true;
            if (mission.targetMetric === 'diasConsecutivos' && stats.diasConsecutivos >= mission.targetValue) completada = true;

            if (completada) {
                user.logros.push({ achievementId: missionId, desbloqueadoEn: new Date() });
                user.puntosJuego += mission.points;
                user.puntosJuegoHistorico += mission.points;
                nuevosLogros.push({
                    id: missionId,
                    nombre: mission.title,
                    puntos: mission.points,
                    icono: 'Star'
                });
                
                // Actualizar contador de completados
                mission.completions += 1;
                await mission.save();
            }
        }

        // Eliminamos el bucle for LOGROS_DEFINICION estático que estaba aquí

        // ✅ Guardar todos los cambios en la base de datos
        await user.save();

        return res.json({
            success: true,
            mensaje: 'Puntaje guardado correctamente',
            data: {
                puntosGanados: puntos,
                puntosTemporada: user.puntosJuego,
                nuevosLogros,
                temporada: {
                    nombre: temporada.nombre,
                    numero: temporada.numero,
                    fin: temporada.fin
                }
            }
        });

    } catch (error) {
        console.error('Error al guardar puntaje:', error);
        return res.status(500).json({ success: false, mensaje: 'Error interno al guardar puntaje' });
    }
};

// ─── Obtener ranking real ─────────────────────────────────────────────────────
export const obtenerRanking = async (req, res) => {
    try {
        const userId = req.usuario?.id;

        const jugadores = await User.find({ puntosJuego: { $gt: 0 } })
            .sort({ puntosJuego: -1 })
            .limit(10)
            .select('nombre apellido puntosJuego')
            .lean();

        const ranking = jugadores.map((jugador, index) => {
            const iniciales = jugador.apellido
                ? `${jugador.nombre[0]}${jugador.apellido[0]}`.toUpperCase()
                : jugador.nombre.substring(0, 2).toUpperCase();

            return {
                id: jugador._id.toString(),
                rank: index + 1,
                name: jugador.nombre,
                points: jugador.puntosJuego,
                avatar: iniciales,
                esYo: userId && jugador._id.toString() === userId
            };
        });

        const temporada = await obtenerOCrearTemporada();

        return res.json({
            success: true,
            data: {
                ranking,
                temporada: {
                    nombre: temporada.nombre,
                    numero: temporada.numero,
                    inicio: temporada.inicio,
                    fin: temporada.fin,
                    activa: temporada.activa
                }
            }
        });

    } catch (error) {
        console.error('Error al obtener ranking:', error);
        return res.status(500).json({ success: false, mensaje: 'Error interno al obtener ranking' });
    }
};

// ─── Obtener info de la temporada actual ──────────────────────────────────────
export const obtenerTemporada = async (req, res) => {
    try {
        const temporada = await obtenerOCrearTemporada();

        return res.json({
            success: true,
            data: {
                nombre: temporada.nombre,
                numero: temporada.numero,
                inicio: temporada.inicio,
                fin: temporada.fin,
                activa: temporada.activa
            }
        });
    } catch (error) {
        console.error('Error al obtener temporada:', error);
        return res.status(500).json({ success: false, mensaje: 'Error interno al obtener temporada' });
    }
};

// ─── Obtener logros del usuario ───────────────────────────────────────────────
export const obtenerLogros = async (req, res) => {
    try {
        const userId = req.usuario.id;

        const user = await User.findById(userId).select('logros estadisticasJuego puntosJuego').lean();
        if (!user) return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });

        const logrosDesbloqueados = (user.logros || []).map(l => l.achievementId);
        const stats = user.estadisticasJuego || {};

        const misiones = await Mission.find({ active: true }).sort({ points: 1 });

        const logrosCompletos = misiones.map(mission => {
            const missionId = mission._id.toString();
            const desbloqueado = logrosDesbloqueados.includes(missionId);
            const infoLogro = desbloqueado
                ? user.logros.find(l => l.achievementId === missionId)
                : null;

            let icono = 'Star';
            if (mission.type === 'recycling') icono = 'Recycle';
            if (mission.type === 'nature') icono = 'TreeDeciduous';
            if (mission.type === 'water') icono = 'Droplets';
            if (mission.type === 'eco') icono = 'Leaf';

            return {
                id: missionId,
                nombre: mission.title,
                descripcion: mission.description,
                puntos: mission.points,
                icono: icono,
                desbloqueado,
                desbloqueadoEn: infoLogro ? infoLogro.desbloqueadoEn : null
            };
        });

        return res.json({
            success: true,
            data: {
                logros: logrosCompletos,
                estadisticas: {
                    residuosRecolectados: stats.residuosRecolectados || 0,
                    rachaMaxima: stats.rachaMaxima || 0,
                    partidasJugadas: stats.partidasJugadas || 0,
                    diasConsecutivos: stats.diasConsecutivos || 0,
                    partidasPerfectas: stats.partidasPerfectas || 0,
                    puntosTemporada: user.puntosJuego || 0
                }
            }
        });

    } catch (error) {
        console.error('Error al obtener logros:', error);
        return res.status(500).json({ success: false, mensaje: 'Error interno al obtener logros' });
    }
};
