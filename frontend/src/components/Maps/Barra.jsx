import { useState } from "react";
import {
    Search, Filter, Locate, Recycle,
    MapPin, Truck, Package, TreeDeciduous, Map, X
} from "lucide-react";

const recyclingCategories = [
    { id: "all",        label: "Todos",           icon: Map,           color: "#22c55e", bg: "from-green-400 to-emerald-500" },
    { id: "recycling",  label: "Reciclaje",       icon: Recycle,       color: "#16a34a", bg: "from-green-500 to-green-700" },
    { id: "ecobottle",  label: "Eco-Botella",     icon: MapPin,        color: "#65a30d", bg: "from-lime-500 to-green-500" },
    { id: "truck",      label: "Recolector",      icon: Truck,         color: "#0d9488", bg: "from-teal-500 to-emerald-600" },
    { id: "container",  label: "Contenedor",      icon: Package,       color: "#059669", bg: "from-emerald-500 to-teal-600" },
    { id: "green_zone", label: "Zona Verde",      icon: TreeDeciduous, color: "#15803d", bg: "from-green-600 to-emerald-700" },
];

export default function SearchBar({ setSearchTerm, setSelectedCategory, setSelectedPlace }) {
    const [searchText, setSearchText] = useState("");
    const [currentCategory, setCurrentCategory] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = () => { setSearchTerm(searchText); setSelectedPlace(null); };

    const handleCategorySelect = (id) => {
        setCurrentCategory(id);
        setSelectedCategory(id);
        setSelectedPlace(null);
    };

    const clearSearch = () => {
        setSearchText("");
        setSearchTerm("");
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            setSelectedPlace({ lat: latitude, lng: longitude, name: "Mi ubicación", vicinity: "Estás aquí", timestamp: Date.now() });
        });
    };

    return (
        <div className="relative z-30 w-full px-4 sm:px-6 -mt-6 sm:-mt-8">
            <div className="mx-auto max-w-5xl space-y-3">

                {/* SEARCH ROW */}
                <div className="flex gap-2 sm:gap-3">
                    {/* Input */}
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-400 group-focus-within:text-green-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar puntos de reciclaje..."
                            value={searchText}
                            onChange={(e) => { setSearchText(e.target.value); setSearchTerm(e.target.value); }}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="w-full pl-10 sm:pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl
                                bg-white/90 backdrop-blur-xl border border-green-200/80
                                focus:border-green-400 focus:ring-4 focus:ring-green-400/15
                                outline-none transition-all duration-300
                                text-green-900 placeholder-green-400/70 text-sm sm:text-base
                                shadow-[0_4px_20px_rgba(34,197,94,0.12)]
                                focus:shadow-[0_4px_24px_rgba(34,197,94,0.22)]"
                        />
                        {searchText && (
                            <button onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors">
                                <X className="w-3 h-3 text-green-600" />
                            </button>
                        )}
                    </div>

                    {/* Filter toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3.5 sm:py-4 rounded-2xl
                            border transition-all duration-300 text-sm font-medium whitespace-nowrap
                            ${showFilters
                                ? "bg-green-500 border-green-500 text-white shadow-[0_4px_20px_rgba(34,197,94,0.4)]"
                                : "bg-white/90 backdrop-blur-xl border-green-200/80 text-green-700 hover:border-green-400"
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filtros</span>
                    </button>

                    {/* Search button */}
                    <button
                        onClick={handleSearch}
                        className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-7 py-3.5 sm:py-4 rounded-2xl
                            bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm
                            shadow-[0_4px_20px_rgba(34,197,94,0.35)] hover:shadow-[0_6px_28px_rgba(34,197,94,0.5)]
                            hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap"
                    >
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">Buscar</span>
                    </button>

                    {/* Location */}
                    <button
                        onClick={getCurrentLocation}
                        title="Mi ubicación"
                        className="flex items-center justify-center w-12 sm:w-auto sm:gap-2 sm:px-5 py-3.5 sm:py-4 rounded-2xl
                            bg-white/90 backdrop-blur-xl border border-green-200/80 text-green-600
                            hover:bg-green-50 hover:border-green-400 transition-all duration-200
                            shadow-[0_4px_20px_rgba(34,197,94,0.08)]"
                    >
                        <Locate className="w-4 h-4" />
                        <span className="hidden sm:inline text-sm font-medium">Ubicación</span>
                    </button>
                </div>

                {/* FILTERS PANEL */}
                <div className={`overflow-hidden transition-all duration-400 ease-out
                    ${showFilters ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5
                        border border-green-200/60 shadow-[0_4px_24px_rgba(34,197,94,0.1)]">
                        <p className="text-xs font-semibold text-green-500 uppercase tracking-widest mb-3">Categorías</p>
                        <div className="flex flex-wrap gap-2">
                            {recyclingCategories.map((cat, i) => {
                                const Icon = cat.icon;
                                const active = currentCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategorySelect(cat.id)}
                                        style={{ animationDelay: `${i * 50}ms` }}
                                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium
                                            transition-all duration-200 animate-filter-in
                                            ${active
                                                ? `bg-gradient-to-r ${cat.bg} text-white shadow-lg scale-105`
                                                : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:scale-105"
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes filterIn {
                    from { opacity: 0; transform: translateY(8px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0)   scale(1);    }
                }
                .animate-filter-in { animation: filterIn 0.35s ease-out forwards; }
            `}</style>
        </div>
    );
}