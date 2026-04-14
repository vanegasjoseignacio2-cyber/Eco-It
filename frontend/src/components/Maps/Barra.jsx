import { useState } from "react";
import {
    Search,
    Filter,
    Locate,
    Recycle,
    MapPin,
    Truck,
    Package,
    TreeDeciduous,
    Map,
} from "lucide-react";

const recyclingCategories = [
    { id: "all",        label: "Todos",             icon: Map,           color: "from-green-400 to-emerald-500" },
    { id: "recycling",  label: "Punto Reciclaje",   icon: Recycle,       color: "from-green-500 to-green-600" },
    { id: "ecobottle",  label: "Eco-Botella",       icon: MapPin,        color: "from-lime-500 to-green-500" },
    { id: "truck",      label: "Recolector",        icon: Truck,         color: "from-emerald-500 to-teal-500" },
    { id: "container",  label: "Contenedor",        icon: Package,       color: "from-teal-500 to-green-700" },
    { id: "green_zone", label: "Zona Verde",        icon: TreeDeciduous, color: "from-green-600 to-emerald-700" },
];

export default function SearchBar({ setSearchTerm, setSelectedCategory, setSelectedPlace }) {
    const [searchText, setSearchText] = useState("");
    const [currentCategory, setCurrentCategory] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = () => {
        setSearchTerm(searchText);
        setSelectedPlace(null);
    };

    const handleCategorySelect = (id) => {
        setCurrentCategory(id);
        setSelectedCategory(id);
        setSelectedPlace(null);
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            setSelectedPlace({
                lat: latitude,
                lng: longitude,
                name: "Mi ubicación",
                vicinity: "Estás aquí",
                timestamp: Date.now()
            });
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
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setSearchTerm(e.target.value); // Búsqueda instantánea
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="w-full pl-12 pr-4 py-4 rounded-3xl bg-white/80 backdrop-blur-sm
              border-2 border-green-200 focus:border-green-500 focus:ring-4
              focus:ring-green-500/20 outline-none transition-all
              text-green-900 placeholder-green-500 shadow-lg"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-6 py-4 rounded-3xl bg-white/80
            backdrop-blur-sm border-2 transition-all font-medium
            ${showFilters ? "border-green-500 text-green-600 shadow-inner" : "border-green-200 text-green-700 shadow-lg hover:border-green-500"}`}
                    >
                        <Filter className="w-5 h-5" />
                        Filtros
                    </button>

                    <button
                        onClick={handleSearch}
                        className="flex items-center gap-2 px-10 py-4 rounded-3xl
            bg-gradient-to-r from-green-500 to-emerald-600
            text-white font-bold shadow-lg hover:shadow-xl
            hover:scale-105 transition-all"
                    >
                        <Search className="w-5 h-5" />
                        Buscar
                    </button>

                    <button
                        onClick={getCurrentLocation}
                        className="flex items-center gap-2 px-6 py-4 rounded-3xl
            bg-green-500 hover:bg-green-600 text-white font-medium
            transition-all shadow-lg"
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
                                    onClick={() => handleCategorySelect(cat.id)}
                                    style={{ animationDelay: `${index * 60}ms` }}
                                    className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium
                    transition-all duration-300 ease-out
                                        hover:-translate-y-0.5 hover:shadow-md
                                        animate-fade-in-up
                                                                    ${currentCategory === cat.id
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
