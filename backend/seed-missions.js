import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mission from './models/mission.js';

dotenv.config();

const misionesSeed = [
    {
        title: 'Primer Reciclaje',
        description: 'Recicla tu primer residuo en el juego',
        points: 100,
        type: 'recycling',
        targetMetric: 'residuosRecolectados',
        targetValue: 1
    },
    {
        title: 'Racha Ecológica',
        description: 'Consigue una racha de 5 aciertos seguidos',
        points: 200,
        type: 'eco',
        targetMetric: 'rachaMaxima',
        targetValue: 5
    },
    {
        title: 'Eco Warrior',
        description: 'Recicla 50 residuos en total',
        points: 500,
        type: 'recycling',
        targetMetric: 'residuosRecolectados',
        targetValue: 50
    },
    {
        title: 'Guardián del Bosque',
        description: 'Juega 10 partidas',
        points: 1000,
        type: 'nature',
        targetMetric: 'partidasJugadas',
        targetValue: 10
    },
    {
        title: 'Clasificador Experto',
        description: 'Clasifica correctamente 100 residuos',
        points: 750,
        type: 'recycling',
        targetMetric: 'residuosRecolectados',
        targetValue: 100
    },
    {
        title: 'Héroe del Planeta',
        description: 'Acumula 10.000 puntos en una temporada',
        points: 5000,
        type: 'eco',
        targetMetric: 'puntosTemporada',
        targetValue: 10000
    },
    {
        title: 'Maratonista Verde',
        description: 'Juega 5 días seguidos',
        points: 400,
        type: 'eco',
        targetMetric: 'diasConsecutivos',
        targetValue: 5
    },
    {
        title: 'Perfeccionista',
        description: 'Termina una partida sin ningún error',
        points: 1500,
        type: 'eco',
        targetMetric: 'partidasPerfectas',
        targetValue: 1
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a la base de datos');

        // Opcional: limpiar misiones existentes si se desea
        // await Mission.deleteMany({});
        // console.log('🗑️ Misiones anteriores eliminadas');

        // Insertar nuevas misiones si no existen por título
        for (const mision of misionesSeed) {
            const existe = await Mission.findOne({ title: mision.title });
            if (!existe) {
                await Mission.create(mision);
                console.log(`✅ Misión creada: ${mision.title}`);
            } else {
                console.log(`⚠️ La misión ya existe: ${mision.title}`);
            }
        }

        console.log('🎉 Seed de misiones finalizado');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en el seed:', error);
        process.exit(1);
    }
};

seedDB();
