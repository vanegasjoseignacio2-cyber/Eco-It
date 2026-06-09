import mongoose from 'mongoose';

const seasonSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    inicio: {
        type: Date,
        required: true
    },
    fin: {
        type: Date,
        required: true
    },
    activa: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Season = mongoose.model('Season', seasonSchema);

export default Season;
