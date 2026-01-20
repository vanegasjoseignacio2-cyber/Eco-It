import { useState } from "react";
import {
    Search,
    Filter,
    Locate,
    Map,
    Recycle,
    TreeDeciduous,
    Battery,
    Trash2,
    Droplets,
} from "lucide-react";

const recyclingCategories = [
    { id: "all", label: "Todos", icon: Map, color: "from-green-400 to-emerald-500" },
    { id: "recycling", label: "Puntos De Reciclaje", icon: Recycle, color: "from-blue-400 to-cyan-500" },
    { id: "electronic", label: "Electrónicos", icon: Battery, color: "from-yellow-400 to-orange-500" },
    { id: "general", label: "General", icon: Trash2, color: "from-gray-400 to-gray-600" },
    // { id: "ADAMA", label: "ADAMA", icon: Droplets, color: "from-cyan-400 to-blue-500" },
];

export default function SearchBar({ setPlaces, setSelectedPlace }) {
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    const searchPlaces = async () => {
        if (!searchText) return;

        const query =
            selectedCategory === "all"
                ? `${searchText} Garzón Huila Colombia`
                : `${searchText} ${selectedCategory} Garzón Huila Colombia`;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query
                )}&limit=10`
            );

            const data = await response.json();

            const formatted = data.map((place) => ({
                place_id: place.place_id,
                name: place.display_name.split(",")[0],
                vicinity: place.display_name,
                geometry: {
                    location: {
                        lat: parseFloat(place.lat),
                        lng: parseFloat(place.lon),
                    },
                },
            }));

            setPlaces(formatted);
            setSelectedPlace(null);
        } catch (error) {
            console.error("Error buscando lugares:", error);
        }
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;

            const query =
                selectedCategory === "all"
                    ? `near ${latitude},${longitude}`
                    : `${selectedCategory} near ${latitude},${longitude}`;

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query
                )}&limit=10`
            );

            const data = await response.json();

            const formatted = data.map((place) => ({
                place_id: place.place_id,
                name: place.display_name.split(",")[0],
                vicinity: place.display_name,
                geometry: {
                    location: {
                        lat: parseFloat(place.lat),
                        lng: parseFloat(place.lon),
                    },
                },
            }));

            setPlaces(formatted);
            setSelectedPlace(null);
        });
    };

    return (
        <div className="relative z-30 w-4/5 mx-auto px-4 -mt-8">
            <div className="mx-auto max-w-[90rem] space-y-4">

                {/* SEARCH BAR */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                        <input
                            type="text"
                            placeholder="Buscar ubicaciones..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && searchPlaces()}
                            className="w-full pl-12 pr-4 py-4 rounded-3xl bg-white/80 backdrop-blur-sm
              border-2 border-green-200 focus:border-green-500 focus:ring-4
              focus:ring-green-500/20 outline-none transition-all
              text-green-900 placeholder-green-500"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white/80
            backdrop-blur-sm border-2 border-green-200 hover:border-green-500
            transition-all text-green-700 font-medium"
                    >
                        <Filter className="w-5 h-5" />
                        Filtros
                    </button>

                    <button
                        onClick={searchPlaces}
                        className="flex items-center gap-2 px-6 py-4 rounded-3xl
            bg-gradient-to-r from-green-500 to-emerald-600
            text-white font-medium shadow-lg hover:shadow-xl
            hover:scale-105 transition-all"
                    >
                        <Search className="w-5 h-5" />
                        Buscar
                    </button>

                    <button
                        onClick={getCurrentLocation}
                        className="flex items-center gap-2 px-6 py-4 rounded-3xl
            bg-green-500 hover:bg-green-600 text-white font-medium
            transition-all"
                    >
                        <Locate className="w-5 h-5" />
                        Mi Ubicación
                    </button>
                </div>

                {/* FILTERS (ANIMADOS) */}
                <div
                    className={`
            origin-top transform transition-all duration-300 ease-out
            ${showFilters
                            ? "scale-y-100 opacity-100 max-h-[500px]"
                            : "scale-y-0 opacity-0 max-h-0"}
            bg-white/60 backdrop-blur-sm rounded-2xl p-6
            border-2 border-green-100 overflow-hidden
          `}
                >
                    <h3 className="text-lg font-semibold text-green-900 mb-4">
                        Categorías
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {recyclingCategories.map((cat, index) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    style={{ animationDelay: `${index * 60}ms` }}
                                    className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium
                    transition-all duration-300 ease-out
                                        hover:-translate-y-0.5 hover:shadow-md
                                        animate-fade-in-up
                                                                    ${selectedCategory === cat.id
                                            ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                                            : `bg-gradient-to-br 
                                    from-green-100 via-emerald-100 to-teal-100 
                                    text-green-700 border border-green-200
                                    hover:from-teal-100 hover:via-emerald-100 hover:to-green-100
                                    hover:scale-105 hover:shadow-md hover:-translate-y-1
                                    transition-all duration-500 ease-out`
                                }


                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ANIMACIONES */}
            <style>{`
            @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(12px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
            }
            .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
            }
        `}</style>
        </div>
    );
}
