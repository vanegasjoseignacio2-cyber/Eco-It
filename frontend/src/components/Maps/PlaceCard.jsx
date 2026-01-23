//carta donde aparecn los resultados de búsqueda
export default function PlaceCard({ place, onClick }) {
    return (
        <button
            onClick={onClick}
            className=" relative w-full z-20 text-left bg-white rounded-2xl p-4 shadow hover:shadow-md transition"
        >
            <h4 className="font-semibold text-green-800">{place.name}</h4>
            <p className="text-sm text-green-600 line-clamp-2">{place.vicinity}</p>
        </button>
    );
}