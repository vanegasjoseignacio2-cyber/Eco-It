import express from "express";
import { obtenerPuntosPublic } from "../controllers/puntosController.js";

const router = express.Router();

// GET público — solo puntos activos y visibles
router.get("/points", obtenerPuntosPublic);

export default router;
