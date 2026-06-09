import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['recycling', 'nature', 'water', 'eco'],
        default: 'eco'
    },
    points: {
        type: Number,
        required: true,
        default: 50
    },
    active: {
        type: Boolean,
        default: true
    },
    targetMetric: {
        type: String,
        enum: ['residuosRecolectados', 'rachaMaxima', 'partidasJugadas', 'puntosTemporada', 'partidasPerfectas', 'diasConsecutivos'],
        required: true
    },
    targetValue: {
        type: Number,
        required: true,
        min: 1
    },
    completions: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model('Mission', missionSchema);
