import jwt from "jsonwebtoken";
import Users from "../models/user.js";

// verifica el token y consulta el usuario actualizado en BD
export const verificarToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ message: "Token requerido"});
        }

        const token = authHeader.split(" ")[1];

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
        return res.satus(403).json({ message: "Acesso denegado: se requiere rol user"});
    }
    next();
}