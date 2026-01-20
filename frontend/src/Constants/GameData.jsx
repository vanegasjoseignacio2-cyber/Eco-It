const gameData = {
    features: [
        {
            id: 'feature_1',
            icon: 'Target',
            title: "Misiones Ecológicas",
            description: "Completa desafíos de reciclaje y sostenibilidad para ganar puntos",
            color: "from-green-400 to-emerald-500",
        },
        {
            id: 'feature_2',
            icon: 'Trophy',
            title: "Logros y Medallas",
            description: "Desbloquea logros exclusivos por tus acciones eco-amigables",
            color: "from-yellow-400 to-orange-500",
        },
        {
            id: 'feature_3',
            icon: 'Users',
            title: "Competencias Globales",
            description: "Compite con usuarios de todo el mundo en rankings semanales",
            color: "from-blue-400 to-cyan-500",
        },
        {
            id: 'feature_4',
            icon: 'Zap',
            title: "Power-ups Verdes",
            description: "Obtén bonificaciones especiales por rachas de reciclaje",
            color: "from-lime-400 to-green-500",
        },
    ],

    // 🎯 LOGROS - Conectar a MongoDB más adelante
    // Estructura de documento en MongoDB:
    // {
    //   _id: ObjectId,
    //   userId: ObjectId (referencia al usuario),
    //   achievementId: String,
    //   name: String,
    //   points: Number,
    //   unlocked: Boolean,
    //   unlockedAt: Date,
    //   icon: String
    // }
    achievements: [
        {
            id: 'achievement_001',
            icon: 'Leaf',
            name: "Primer Reciclaje",
            points: 100,
            unlocked: true
        },
        {
            id: 'achievement_002',
            icon: 'Recycle',
            name: "Eco Warrior",
            points: 500,
            unlocked: true
        },
        {
            id: 'achievement_003',
            icon: 'TreeDeciduous',
            name: "Guardián del Bosque",
            points: 1000,
            unlocked: false
        },
        {
            id: 'achievement_004',
            icon: 'Star',
            name: "Héroe del Planeta",
            points: 5000,
            unlocked: false
        },
    ],

    // 🏆 RANKING - Conectar a MongoDB más adelante
    // Estructura de documento en MongoDB:
    // {
    //   _id: ObjectId,
    //   userId: ObjectId,
    //   username: String,
    //   points: Number,
    //   avatar: String,
    //   lastUpdated: Date,
    //   weeklyRank: Number,
    //   globalRank: Number
    // }
    leaderboard: [
        {
            id: 'user_001',
            rank: 1,
            name: "Luisito34",
            points: 45680,
            avatar: "34"
        },
        {
            id: 'user_002',
            rank: 2,
            name: "Miguelito",
            points: 42150,
            avatar: "M"
        },
        {
            id: 'user_003',
            rank: 3,
            name: "Caleb con c y con b",
            points: 38920,
            avatar: "CB"
        },
        {
            id: 'user_004',
            rank: 4,
            name: "Andrés Sofía",
            points: 35400,
            avatar: "AS"
        },
        {
            id: 'user_005',
            rank: 5,
            name: "Tapiero",
            points: 32100,
            avatar: "T"
        },
    ],
};

export default gameData;