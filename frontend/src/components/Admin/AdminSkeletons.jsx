import ContentLoader from "react-content-loader";

/**
 * Skeleton para las tarjetas KPI superiores (Dashboard, Estadísticas, Juego)
 */
export const KpiSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-green-100 rounded-2xl p-5 shadow-sm">
                <ContentLoader
                    speed={1.2}
                    width={200}
                    height={80}
                    viewBox="0 0 200 80"
                    backgroundColor="#f0fdf4"
                    foregroundColor="#dcfce7"
                >
                    <rect x="0" y="0" rx="10" ry="10" width="40" height="40" />
                    <rect x="50" y="10" rx="5" ry="5" width="100" height="20" />
                    <rect x="0" y="55" rx="5" ry="5" width="80" height="25" />
                    <rect x="90" y="60" rx="5" ry="5" width="60" height="15" />
                </ContentLoader>
            </div>
        ))}
    </div>
);

/**
 * Skeleton para tablas (Usuarios, Actividad Reciente)
 */
export const TableSkeleton = ({ rows = 5 }) => (
    <div className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-green-50 bg-green-50/30">
            <ContentLoader
                speed={1.2}
                width={200}
                height={20}
                viewBox="0 0 200 20"
                backgroundColor="#f0fdf4"
                foregroundColor="#dcfce7"
            >
                <rect x="0" y="0" rx="5" ry="5" width="150" height="20" />
            </ContentLoader>
        </div>
        <div className="divide-y divide-green-50">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="px-6 py-4">
                    <ContentLoader
                        speed={1.2}
                        width={800}
                        height={40}
                        viewBox="0 0 800 40"
                        backgroundColor="#f8fafc"
                        foregroundColor="#f1f5f9"
                        className="w-full"
                    >
                        <rect x="0" y="0" rx="10" ry="10" width="40" height="40" />
                        <rect x="55" y="5" rx="5" ry="5" width="200" height="15" />
                        <rect x="55" y="25" rx="5" ry="5" width="150" height="10" />
                        <rect x="350" y="10" rx="8" ry="8" width="80" height="20" />
                        <rect x="500" y="10" rx="8" ry="8" width="80" height="20" />
                        <rect x="650" y="10" rx="5" ry="5" width="60" height="15" />
                        <rect x="760" y="10" rx="5" ry="5" width="20" height="20" />
                    </ContentLoader>
                </div>
            ))}
        </div>
    </div>
);

/**
 * Skeleton para la gráfica de estadísticas
 */
export const ChartSkeleton = () => (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
        <ContentLoader
            speed={1.2}
            width={700}
            height={300}
            viewBox="0 0 700 300"
            backgroundColor="#f0fdf4"
            foregroundColor="#dcfce7"
            className="w-full h-auto"
        >
            {/* Header */}
            <rect x="0" y="0" rx="5" ry="5" width="150" height="20" />
            <rect x="0" y="30" rx="5" ry="5" width="100" height="12" />
            
            {/* Bars */}
            {Array.from({ length: 12 }).map((_, i) => (
                <rect 
                    key={i} 
                    x={50 + i * 50} 
                    y={100 + Math.random() * 100} 
                    rx="5" ry="5" 
                    width="30" 
                    height={150 - Math.random() * 100} 
                />
            ))}
            
            {/* Grid lines */}
            <rect x="50" y="260" rx="0" ry="0" width="600" height="1" />
            <rect x="50" y="100" rx="0" ry="0" width="1" height="160" />
        </ContentLoader>
    </div>
);

/**
 * Skeleton para listas de items con imagen (Imágenes, Misiones, Mapas)
 */
export const ListSkeleton = ({ rows = 4 }) => (
    <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-green-100 p-4 shadow-sm">
                <ContentLoader
                    speed={1.2}
                    width={400}
                    height={60}
                    viewBox="0 0 400 60"
                    backgroundColor="#f8fafc"
                    foregroundColor="#f1f5f9"
                    className="w-full"
                >
                    <rect x="0" y="0" rx="12" ry="12" width="80" height="60" />
                    <rect x="95" y="10" rx="5" ry="5" width="180" height="15" />
                    <rect x="95" y="35" rx="5" ry="5" width="120" height="12" />
                    <rect x="320" y="15" rx="8" ry="8" width="60" height="25" />
                </ContentLoader>
            </div>
        ))}
    </div>
);

/**
 * Skeleton para el formulario lateral de imágenes
 */
export const FormSkeleton = () => (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 space-y-6">
        <ContentLoader
            speed={1.2}
            width={350}
            height={500}
            viewBox="0 0 350 500"
            backgroundColor="#f0fdf4"
            foregroundColor="#dcfce7"
            className="w-full"
        >
            <rect x="0" y="0" rx="10" ry="10" width="350" height="150" />
            <rect x="0" y="170" rx="5" ry="5" width="100" height="15" />
            <rect x="0" y="195" rx="10" ry="10" width="350" height="40" />
            <rect x="0" y="255" rx="5" ry="5" width="100" height="15" />
            <rect x="0" y="280" rx="10" ry="10" width="350" height="80" />
            <rect x="0" y="380" rx="5" ry="5" width="100" height="15" />
            <rect x="0" y="405" rx="10" ry="10" width="350" height="40" />
            <rect x="0" y="465" rx="12" ry="12" width="165" height="40" />
            <rect x="185" y="465" rx="12" ry="12" width="165" height="40" />
        </ContentLoader>
    </div>
);
