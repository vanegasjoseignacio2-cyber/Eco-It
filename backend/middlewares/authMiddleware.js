import jwt from "jsonwebtoken";
import Users from "../models/user.js";

// verifica el token y consulta el usuario actualizado en BD
export const verificarToken = async (req, res, next) => {
    try {
        // Solo usamos el header Authorization
        let token;
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Token requerido"});
        }

        //decodifica el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //consulta el usuario actualizado en la BD 
        const usuario = await Users.findById(decoded.id).select("-password");
        if (!usuario) {
            return res.status(401).json({ message: "Usuario no encontrado"});
        }

        //Guardamos el usuario completo en req para usarlo en los controladores
        req.usuario = usuario;
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirado, inicia sesion nuevamente"});
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token invalido"});
        }
        res.status(500).json({ message: "Error en la autenticación", error: error.message});
    }
};

//solo administradores y superadministradores
export const soloAdmin = (req, res, next) => {
    if (req.usuario?.rol !== "admin" && req.usuario?.rol !== "superadmin") {
        return res.status(403).json({ message: "Acesso denegado: se requiere rol admin o superadmin"});
    }
    next();
};

// solo superadministradores
export const soloSuperadmin = (req, res, next) => {
    if (req.usuario?.rol !== "superadmin") {
        return res.status(403).json({ message: "Acceso denegado: se requiere rol superadmin" });
    }
    next();
};

// Solo usuarios
export const soloUser = (req, res, next) => {
    if (req.usuario?.rol !== "user") {
        return res.status(403).json({ message: "Acesso denegado: se requiere rol user"});
    }
    next();
}

// Middleware específico para verificar si el usuario está baneado
// Se usa en rutas sensibles (como IA) en lugar de ser global
export const verificarBaneo = async (req, res, next) => {
    if (!req.usuario) return next();

    if (req.usuario.status === 'banned') {
        if (new Date() < new Date(req.usuario.banHasta)) {
            return res.status(403).json({
                error: "Usuario baneado",
                banned: true,
                banReason: req.usuario.banReason,
                banHasta: req.usuario.banHasta,
                message: "Tu acceso a esta función ha sido restringido temporalmente."
            });
        } else {
            // Levantar el ban si ya expiró
            req.usuario.status = 'active';
            req.usuario.banHasta = null;
            req.usuario.banReason = null;
            await req.usuario.save();
        }
    }
    next();
};