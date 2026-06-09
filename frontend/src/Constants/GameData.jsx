// GameData.jsx — Data estática para la página del juego
// Los logros y el ranking REALES vienen del backend (/api/game/logros y /api/game/ranking)
// Esta data se usa solo para las cards de "Features" de la página

const gameData = {
    features: [
        {
            id: 'feature_1',
            icon: 'Target',
            title: 'Clasifica Residuos',
            description: 'Guía la basura hacia el contenedor correcto antes de que toque el suelo',
            color: 'from-green-400 to-emerald-500',
        },
        {
            id: 'feature_2',
            icon: 'AlertTriangle',
            title: 'Esquiva Peligros',
            description: '¡Cuidado con las bombas tóxicas! Si las atrapas, perderás vidas valiosas',
            color: 'from-yellow-400 to-orange-500',
        },
        {
            id: 'feature_3',
            icon: 'Trophy',
            title: 'Ranking de Temporadas',
            description: 'Acumula puntos en cada partida y compite por ser el Héroe del Planeta',
            color: 'from-blue-400 to-cyan-500',
        },
        {
            id: 'feature_4',
            icon: 'Zap',
            title: 'Rachas Perfectas',
            description: 'Encadena aciertos sin equivocarte para activar multiplicadores de puntaje',
            color: 'from-lime-400 to-green-500',
        },
    ],

};

export default gameData;