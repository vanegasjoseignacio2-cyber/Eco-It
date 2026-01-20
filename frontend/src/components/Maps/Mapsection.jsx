// Mapsection.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Trash2, MapPin } from "lucide-react";
import SearchBar from "./Barra";
import MapView from "./MapView";
import ResultsList from "./ResultsList";

export default function MapSection() {
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);

    return (
        <section className="relative overflow-hidden bg-[linear-gradient(20deg,_#bbf7d0,_#d1fae5,_#f0fdfa)]">
            {/* Iconos flotantes de fondo */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => {
                    const Icon = i % 2 === 0 ? Trash2 : MapPin;

                    return (
                        <motion.div
                            key={i}
                            className="absolute text-green-500/15"
                            style={{
                                left: `${10 + i * 12}%`,
                                top: "-50px",
                            }}
                            animate={{
                                y: ["0vh", "110vh"],
                                rotate: [0, 360],
                                opacity: [0, 1, 1, 0],
                            }}
                            transition={{
                                duration: 12 + i * 2,
                                repeat: Infinity,
                                delay: i * 1.5,
                                ease: "linear",
                            }}
                        >
                            <Icon size={25 + i * 8} />
                        </motion.div>
                    );
                })}
            </div>

            {/* CONTENIDO */}
            <div className="relative z-10">
                {/* texto de arriba */}
                <motion.div 
                    className="max-w-7xl mx-auto px-4 pt-36 pb-8 text-center"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-700 mb-4">
                        <Map className="w-4 h-4" />
                        Mapas ecológicos
                    </span>

                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-green-900">
                        Encuentra puntos de{" "}
                        <span className="text-green-600">Reciclaje</span>
                    </h1>

                    <p className="text-lg mb-10 md:text-xl max-w-3xl mx-auto text-green-800">
                        Descubre los puntos de reciclaje, contenedores y espacios verdes más cercanos a ti.
                    </p>
                </motion.div>

                {/* BARRA DE BÚSQUEDA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <SearchBar setPlaces={setPlaces} setSelectedPlace={setSelectedPlace} />
                </motion.div>

                {/* sección donde está el mapa y los resultados de las búsquedas */}
                <div className="w-full px-6 pb-14 pt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-[74rem] mx-auto">
                        
                        {/* Mapa */}
                        <motion.div 
                            className="lg:col-span-2 h-[420px] rounded-3xl overflow-hidden shadow-md relative z-0"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                                duration: 0.8, 
                                delay: 0.4,
                                type: "spring",
                                stiffness: 100
                            }}
                        >
                            <MapView
                                places={places}
                                selectedPlace={selectedPlace}
                                onMarkerClick={setSelectedPlace}
                            />
                        </motion.div>

                        {/* Resultados*/}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                                duration: 0.8, 
                                delay: 0.6,
                                type: "spring",
                                stiffness: 100
                            }}
                        >
                            <ResultsList places={places} onSelect={setSelectedPlace} />
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}