import mongoose from "mongoose";

const puntoReciclajeSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre del punto es obligatorio"],
        trim: true
    },
    tipo: {
        type: String,
        required: [true, "El tipo de punto es obligatorio"],
        enum: ["recycling", "ecobottle", "truck", "container", "green_zone"],
        default: "recycling"
    },
    lat: {
        type: Number,
        required: [true, "La latitud es obligatoria"]
    },
    lng: {
        type: Number,
        required: [true, "La longitud es obligatoria"]
    },
    descripcion: {
        type: String,
        default: ""
    },
    imagen: {
        type: String,
        default: ""
    },
    activo: {
        type: Boolean,
        default: true
    },
    visibleToUser: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const PuntoReciclaje = mongoose.model("PuntoReciclaje", puntoReciclajeSchema);

export default PuntoReciclaje;
