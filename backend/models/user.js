import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// definimos la estructura del usuario
const userSchema = new mongoose.Schema({
    // informacion personal
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    apellido: {
        type: String,
        required: function () {
            return this.authProvider !== 'google';
        }
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
    },
    telefono: {
        type: String,
        required: function () {
            return this.authProvider !== 'google';
        }
    },
    edad: {
        type: Number,
        required: function () {
            return this.authProvider !== 'google';
        }
    },
    password: {
        type: String,
        required: function () {
            return this.authProvider !== 'google';
        },
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        select: false
    },
    perfilCompleto: {
        type: Boolean,
        default: false
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    googleId: {
        type: String,
        default: null
    },
    rol: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    historialConsultas: [{
        pregunta: String,
        respuesta: String,
        imagen: String,
        fecha: {
            type: Date,
            default: Date.now
        }
    }],
    puntosFavoritos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PuntoReciclaje'
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date

}, {
    timestamps: true
});

// ✅ Middleware corregido: maneja usuarios de Google sin password
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.compararPassword = async function (passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;