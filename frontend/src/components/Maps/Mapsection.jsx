import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Map, Trash2, MapPin, Leaf, Recycle } from "lucide-react";
import { io } from "socket.io-client";
import SearchBar from "./Barra";
import MapView from "./MapView";
import ResultsList from "./ResultsList";
import RutasEco from "./Rutas";

// Floating icon config
const FLOATERS = [
    { Icon: Recycle, x: "8%",  size: 28, dur: 18, delay: 0   },
    { Icon: Leaf,    x: "20%", size: 20, dur: 22, delay: 3   },
    { Icon: MapPin,  x: "35%", size: 24, dur: 16, delay: 6   },
    { Icon: Trash2,  x: "52%", size: 18, dur: 20, delay: 2   },
    { Icon: Recycle, x: "67%", size: 32, dur: 25, delay: 8   },
    { Icon: Leaf,    x: "80%", size: 22, dur: 14, delay: 4   },
    { Icon: MapPin,  x: "90%", size: 26, dur: 19, delay: 10  },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const fadeUp  = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };

export default function MapSection() {
    const [allPoints, setAllPoints]         = useState([]);
    const [searchTerm, setSearchTerm]       = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedPlace, setSelectedPlace] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/map/points")
            .then(r => r.json())
            .then(data => { if (data.success) setAllPoints(data.puntos); })
            .catch(console.error);

        const socket = io("http://localhost:3000");
        socket.on("map:updated", ({ puntos }) => setAllPoints(puntos));
        return () => socket.disconnect();
    }, []);

    const filteredPoints = useMemo(() => {
        let f = allPoints;
        if (selectedCategory !== "all") f = f.filter(p => p.tipo === selectedCategory);
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            f = f.filter(p => p.nombre.toLowerCase().includes(q) || (p.descripcion?.toLowerCase().includes(q)));
        }
        return f;
    }, [allPoints, searchTerm, selectedCategory]);

    const placesForList = useMemo(() => filteredPoints.map(p => ({
        place_id: p._id, name: p.nombre, vicinity: p.descripcion || p.tipo,
        lat: p.lat, lng: p.lng, type: p.tipo,
    })), [filteredPoints]);

    return (
        <section className="relative overflow-hidden min-h-screen"
            style={{ background: "linear-gradient(160deg, #f0fdf4 0%, #dcfce7 30%, #d1fae5 60%, #ccfbf1 100%)" }}>

            {/* Mesh background blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-green-300/20 blur-[80px]" />
                <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-emerald-300/20 blur-[60px]" />
                <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-teal-300/15 blur-[70px]" />
            </div>

            {/* Floating icons */}
            <div className="absolute inset-0 pointer-events-none">
                {FLOATERS.map(({ Icon, x, size, dur, delay }, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-green-600/30"
                        style={{ left: x, top: "-60px" }}
                        animate={{ y: ["0vh", "115vh"], rotate: [0, 360], opacity: [0, 0.8, 0.8, 0] }}
                        transition={{ duration: dur, repeat: Infinity, delay, ease: "linear" }}
                    >
                        <Icon size={size} />
                    </motion.div>
                ))}
            </div>

            {/* CONTENT */}
            <div className="relative z-10">

                {/* HERO */}
                <motion.div
                    className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-10 sm:pb-12 text-center"
                    variants={stagger} initial="hidden" animate="visible"
                >
                    <motion.div variants={fadeUp}>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                            bg-green-500/10 border border-green-400/20 text-green-700 text-xs sm:text-sm font-semibold mb-5 backdrop-blur-sm">
                            <Map className="w-3.5 h-3.5" />
                            Mapas ecológicos en tiempo real
                        </span>
                    </motion.div>

                    <motion.h1 variants={fadeUp}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-green-950 leading-[1.1] tracking-tight mb-4">
                        Encuentra puntos de{" "}
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                                Reciclaje
                            </span>

                        </span>
                    </motion.h1>

                    <motion.p variants={fadeUp}
                        className="text-base sm:text-lg text-green-800/70 max-w-2xl mx-auto leading-relaxed">
                        Descubre puntos de reciclaje, contenedores y espacios verdes cercanos a ti, actualizados en tiempo real.
                    </motion.p>
                </motion.div>

                {/* SEARCH BAR */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <SearchBar
                        setSearchTerm={setSearchTerm}
                        setSelectedCategory={setSelectedCategory}
                        setSelectedPlace={setSelectedPlace}
                    />
                </motion.div>

                {/* MAP + RESULTS */}
                <div className="w-full px-4 sm:px-6 pb-8 pt-6 sm:pt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">

                        {/* Map */}
                        <motion.div
                            className="lg:col-span-2 h-[320px] sm:h-[400px] lg:h-[440px] rounded-3xl overflow-hidden relative z-0
                                shadow-[0_8px_40px_rgba(34,197,94,0.2)] border border-green-200/40"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 90 }}
                        >
                            <MapView
                                points={filteredPoints}
                                selectedPlace={selectedPlace}
                                onMarkerClick={setSelectedPlace}
                            />
                        </motion.div>

                        {/* Results */}
                        <motion.div
                            className="h-[320px] sm:h-[400px] lg:h-[440px]"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.65, duration: 0.6, type: "spring", stiffness: 90 }}
                        >
                            <ResultsList places={placesForList} onSelect={setSelectedPlace} />
                        </motion.div>
                    </div>
                </div>

                {/* RUTAS ECO */}
                <div className="px-4 sm:px-6">
                    <RutasEco />
                </div>
            </div>
        </section>
    );
}