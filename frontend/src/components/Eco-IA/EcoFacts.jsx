import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const ECO_FACTS = [
    "Reciclar aluminio ahorra hasta un 95% de energia comparado con producirlo desde materia prima",
    "Una lata de aluminio reciclada puede ahorrar suficiente energia para ver TV durante 3 horas",
    "El aluminio puede reciclarse indefinidamente sin perder calidad",
    "Alrededor del 75% del aluminio producido en la historia sigue en uso hoy",
    "Reciclar papel puede reducir el consumo de energia en su produccion en aproximadamente un 40%",
    "El papel reciclado utiliza menos agua que el papel fabricado desde pulpa virgen",
    "El vidrio es 100% reciclable y puede reutilizarse infinitamente sin perder calidad",
    "Reciclar vidrio reduce la energia necesaria para su fabricacion",
    "Por cada tonelada de vidrio reciclado se evita extraer mas de una tonelada de materias primas",
    "El reciclaje reduce significativamente las emisiones de gases de efecto invernadero",
    "Los vertederos son una de las principales fuentes de metano generado por residuos organicos",
    "El metano tiene un potencial de calentamiento global mucho mayor que el CO2",
    "Compostar residuos organicos reduce la cantidad de basura enviada a vertederos",
    "El compostaje ayuda a mejorar la calidad del suelo y retener humedad",
    "Reciclar plastico reduce la necesidad de producir plastico nuevo a partir de petroleo",
    "La produccion de plastico reciclado requiere menos energia que el plastico virgen",
    "Millones de toneladas de plastico terminan en los oceanos cada año",
    "Reducir, reutilizar y reciclar ayuda a conservar recursos naturales limitados",
    "El reciclaje contribuye al desarrollo de la economia circular",
    "Reutilizar productos reduce el impacto ambiental mas que reciclarlos",
    "La produccion de materiales reciclados genera menos contaminacion del aire",
    "Separar correctamente los residuos mejora la eficiencia del reciclaje",
    "El reciclaje ayuda a disminuir la cantidad de basura en vertederos y rellenos sanitarios",
    "Los residuos organicos pueden representar una gran parte de la basura domestica",
    "El uso de materiales reciclados reduce la extraccion de recursos naturales",
    "Reciclar una tonelada de papel salva aproximadamente 17 arboles",
    "Se necesitan hasta 500 anos para que una botella de plastico se degrade en un vertedero",
    "El acero es el material mas reciclado del mundo por volumen",
    "Reciclar acero ahorra hasta un 75% de la energia frente a producirlo desde mineral virgen",
    "Una botella de vidrio tarda mas de 4000 anos en descomponerse de forma natural",
    "El papel puede reciclarse entre 5 y 7 veces antes de que sus fibras sean demasiado cortas",
    "Reciclar plastico tipo PET consume un 76% menos de energia que fabricarlo desde petroleo",
    "Los telefonos moviles contienen oro, plata, cobre y otros metales valiosos recuperables",
    "Por cada tonelada de papel reciclado se ahorran unos 26000 litros de agua",
    "El carton reciclado puede volver a estar en uso como nuevo producto en menos de 14 dias",
    "Las pilas contienen mercurio, cadmio y plomo que contaminan suelos y aguas si no se reciclan",
    "El aceite de cocina usado puede convertirse en biodiesel si se recicla correctamente",
    "Reciclar una tonelada de aluminio evita la emision de unas 9 toneladas de CO2",
    "Los residuos electronicos o e-waste son el tipo de basura que mas rapido crece en el mundo",
    "Solo el 20% del e-waste mundial se recicla de forma adecuada",
    "El tetrapak es reciclable aunque contiene capas de carton, plastico y aluminio",
    "En Alemania se recicla mas del 65% de los residuos municipales, uno de los indices mas altos del mundo",
    "El reciclaje de neumaticos permite obtener caucho que se usa en canchas deportivas y pavimentos",
    "Los tapones de corcho son 100% reciclables y se usan para fabricar suelos y articulos deportivos",
    "Reciclar una lata de acero ahorra suficiente energia para encender una bombilla durante 4 horas",
    "El plastico tipo 6 o poliestireno expandido es uno de los mas dificiles de reciclar",
    "Las bolsas de plastico pueden tardar entre 100 y 400 anos en degradarse",
    "El papel de periodico reciclado puede convertirse en aislante termico para edificios",
    "La tinta de impresora puede recuperarse y recargarse para reducir residuos electronicos",
    "El agua usada en la produccion de papel reciclado puede depurarse y reutilizarse en el proceso",
    "Las latas de aluminio son el envase mas reciclado en muchos paises desarrollados",
    "El reciclaje de vidrio reduce las emisiones de CO2 de los hornos en aproximadamente un 20% por cada 10% de cullet anadido",
    "El cobre es altamente reciclable y mantiene sus propiedades electricas sin degradarse",
    "Reciclar cobre consume un 85% menos de energia que extraerlo y procesarlo desde mena virgen",
    "Las redes de pesca perdidas en el mar pueden reciclarse para fabricar hilo de nylon",
    "Algunas marcas de ropa fabrican prendas usando botellas de plastico PET recicladas",
    "El carton ondulado tiene una tasa de reciclaje de mas del 80% en varios paises europeos",
    "Los pallets de madera usados pueden repararse y reutilizarse decenas de veces antes de reciclarse",
    "El aceite de motor usado es altamente contaminante pero puede re-refinarse para usarse de nuevo",
    "Un kilo de ropa reutilizada evita la emision de aproximadamente 3.6 kg de CO2",
    "Los colchones viejos pueden reciclarse separando espuma, metal y tela para distintos usos",
    "Las bombillas de bajo consumo contienen mercurio y deben reciclarse en puntos especiales",
    "El vidrio roto o cullet es el ingrediente principal para fabricar nuevo vidrio",
    "El mercado global de materias primas recicladas mueve billones de dolares al ano",
    "En Japon existe el concepto de mottainai que promueve no desperdiciar ningun recurso",
    "El biogas producido por residuos organicos puede usarse como combustible para cocinar o generar electricidad",
    "Reciclar tonelada por tonelada genera mas empleo que enviar residuos al vertedero",
    "Las tapas de plastico de las botellas a menudo son de un tipo de plastico diferente al cuerpo",
    "El reciclaje quimico puede descomponer plasticos en sus moleculas originales para reutilizarlos",
    "Los escombros de construccion pueden triturarse y reutilizarse como base en nuevas obras",
    "La tasa de reciclaje de latas de aluminio en Brasil supera el 97%, la mas alta del mundo",
    "El papel tissue como servilletas y papel de bano no puede reciclarse porque sus fibras son muy cortas",
    "El rechazo del reciclaje, residuos que no pueden recuperarse, puede aprovecharse como combustible derivado",
    "El plastico negro de bandejas de supermercado suele ser irreciclable porque confunde los sensores opticos",
    "Algunas ciudades convierten el gas metano de sus vertederos en electricidad para el municipio",
    "La recuperacion de plata de placas de rayos X antiguas es una forma de reciclaje especializado",
    "El poliestireno expandido puede reciclarse por densificacion para fabricar rodapiés y perfiles",
    "Los libros viejos pueden donarse, venderse o reciclarse para fabricar papel de menor calidad",
    "El reciclaje de textiles evita que toneladas de ropa acaben en vertederos cada ano",
    "Algunos aeropuertos reciclan el aceite de las frituras de sus restaurantes para mover sus vehiculos",
    "Las raquetas de tenis viejas pueden reciclarse para recuperar fibra de carbono y aluminio",
    "En Suecia se incinera con recuperacion de energia casi el 50% de los residuos, reciclando el resto",
    "El compost producido en casa puede sustituir fertilizantes quimicos en jardines y huertos",
    "Las cassettes y discos de vinilo antiguos pueden reciclarse para fabricar nuevos articulos de plastico",
    "Los productos con certificacion de reciclaje postconsumo contienen material recuperado despues de su uso",
    "Las tapas metalicas de frascos de conserva pueden reciclarse junto con el acero ordinario",
    "El reciclaje de aluminio produce lingotes que se usan en la industria automotriz y aeroespacial",
    "Una tonelada de plastico reciclado puede evitar la emision de hasta 1.5 toneladas de CO2",
    "Los corchos de plastico no son reciclables en los mismos contenedores que el plastico convencional",
    "El grafito de los lapices puede recuperarse en plantas de reciclaje especializadas",
    "Las impresoras 3D pueden usar filamento fabricado con plastico reciclado",
    "Los paneles solares al final de su vida util contienen silicio y metales que pueden recuperarse",
    "En algunos paises se paga por devolver botellas vacias, lo que incentiva su reciclaje",
    "El mercado de segunda mano digital impulsa el reciclaje indirecto de millones de dispositivos al ano",
    "Los envases de cartón de leche o zumo son reciclables aunque combinen diferentes materiales",
    "El reciclaje reduce el volumen de residuos que se compactan en los vertederos, alargando su vida util",
    "Los grandes festivales de musica generan toneladas de residuos reciclables que suelen desaprovecharse",
    "Algunos paises prohiben el enterramiento de residuos reciclables para forzar su recuperacion"
];

export default function EcoFacts() {
    const [factIndex, setFactIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFactIndex((prev) => (prev + 1) % ECO_FACTS.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden p-5 rounded-3xl"
            style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(236,253,245,0.8) 100%)",
                border: "1px solid rgba(16,185,129,0.15)",
                boxShadow: "0 20px 40px -15px rgba(6,78,59,0.05)",
                backdropFilter: "blur(10px)",
            }}
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-xl bg-emerald-100/80">
                    <Sparkles size={14} className="text-emerald-600" />
                </div>
                <h4 className="font-bold text-[10px] uppercase tracking-[0.25em] text-emerald-800/60">Dato Eco-Inteligente</h4>
            </div>

            <div className="relative min-h-[80px] flex items-center overflow-hidden py-2">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={factIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-[12px] sm:text-[12px] leading-relaxed font-semibold text-emerald-950/80 italic w-full"
                    >
                        "{ECO_FACTS[factIndex]}"
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Decoración */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
        </motion.div>
    );
}
