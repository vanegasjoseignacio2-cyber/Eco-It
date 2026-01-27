import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// definimos la eestrutura del usuario
const userSchema = new mongoose.Schema({
    // informacion personal
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true // elimina espacios en blanco al inicio y final
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido'] // validacion de formato email
    },
    telefono: {
        type: String,
        required: [true, 'El telefono es obligatorio'],
        trim: true
    },
    edad: {
        type: Number,
        required: [true, 'La edad es obligatoria'],
        min: [1, 'La edad debe ser mayor a 0']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        select: false // no incluye la contraseña en las consultas por defecto (seguridad)
    },

    // avatar/foto de perfil (opcional)
    avatar: {
        type: String,
        default: null
    },

    // historial de consultas a la IA
    historailConsultas: [{
        pregunta: String,
        respuesta: String,
        imagen: String,
        fecha: {
            type: Date,
            default: Date.now
        }
    }],

    // Puntos de reciclaje favoritos (para futuras funcionalidades)
    puntosFavoritos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PuntoReciclaje'  // referencia a otro modelo
    }]
}, {
    timestamps: true // agrega campos createdAt y updatedAt automaticamente
});

// Middleware: Se ejecuta antes de guardar un usuario
// Encripta la contraseña antes de gaurdarla en la base de datos
userSchema.pre('save', async function (next) {
    // Solo encripta si la contraseña fue modificada o es nueva
    if (!this.isModified('password')) {
        return;
    }

    // Genera un "salt" (dato aleatorio para mayor seguridad)
    const salt = await bcrypt.genSalt(10);

    // Encripta la contraseña
    this.password = await bcrypt.hash(this.password, salt);
});

// Metodo: compara la contrasela ingresada con la encriptada en la BD
userSchema.methods.compararPassword = async function (passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

// Crea y exporta el modelo del usuario
const User = mongoose.model('User', userSchema);

export default User;