import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, SendHorizonal, AlertCircle, User, Lock, ShieldAlert, X } from "lucide-react";
import ViewportMotion from "../animations/ViewportMotion";
import SendButton from "../button/Buttom";
import { useAuth } from "../../context/AuthContext";

// ─────────────────────────────────────────────────────────────────────────────
// 🔹 Hook de validación de lenguaje ofensivo
// ─────────────────────────────────────────────────────────────────────────────

const PALABRAS_OFENSIVAS = [
    // Español - Colombia
    'mierda','puta','puto','hijueputa','hijueputo','malparido','malparida',
    'gonorrea','marica','idiota','imbécil','imbecil','estúpido','estupido',
    'pendejo','pendeja','coño','verga','culo','perra','perro',
    'maricón','maricon','cabrón','cabron','joder','hostia','gilipollas',
    'follar','chinga','chingada','culero','culera','pinche','mamón','mamon','hp',
    'sapa','sapo','gordo','gorda','carechimba','caremondá','caremonda',
    'chimba','chimbo','penes','vagina','pelado marica','hpta','hijpta',
    'mk','mka','marik','marika','mar1ca','mar!ca','hptas','maricones','tetranutras','tetranutra',
    'pene',

    'sapas','porno','pornografía','xvideos','porn hub','pornhub','mlp','tragaleche','culean',
    'soplamonda','pichaslargas','culear','culito','mia khalifa','polla','zunga','sunga','soplapicha',
    'consolador','mal parido','malparido','malparidos','becerro','mrd','qulo','kulo','teta','chocho',
    'pendejos','cacorro','veneco','veneca','venequito','beneco','chocha','cachon','cachondo',
    'cachocontento','carepicha','monda','cuca','picha','cabezaepicha','pta','catrehijuepta','vrg','vrgs',
    'semen','cervical','qlo','arrecha','zemen','arrecho','vergones','vergotas','verguitas','brga',
    'qk','pipi','polno','polnito','escroto','mierdoso','cmen','smen','gnorrea','gnrrea','conchesumadre',
    'sidoso','leproso','marico','mariko','cacorra','kakorra','vergon','kcorro','pichurria','pichurrioso','mamabicho',
    'culion','pirobo','masturbarse','masturbar','pne','gnrriento','estupida','tontin','webon',
    'weon','aguevado','paraco','guerrillero','onlyfans','brazzers','xxx','mamaburra','mamapolla','homosexual',
    'mariquita','stupida','stupido','culito','hentai','hentay','gore','mtar',
    'despellejar','prepucio','clitoris','glande','squirt','degollar','cabezón','violar','dildo','pto','eyacular','bizcocho',
    'testiculos','culiando','hdp','pichon', 'penetracion', 'penetrar', 'penetrante', 'penetro', 'penetra', 'repenetrable', 'vajina',
    'cuquita', 'qkita', 'cucota', 'qkta', 'nepe', 'japa', 'prostituta', 'xunga', "seno", 
    // Español - Colombia (ampliado)
    'jueputa','jueputas','juepuerca','juepuercas',
    'catrehijueputa','catrehijueputas','catrehijuepuerca',
    'hijuelagranputa','hijueputazo',
    'malparicion','malpario',
    'hp','hpta','hptas',
    'cagada','cagado','cagon','cagona',
    'gonorreas','gonorreoso','gonorreosa',
    'culiparado','culiparada',
    'culiflojo','culifloja',
    'culicagado','culicagada',
    'culigorrion','culigorriona',
    'casposo','casposa',
    'guaricha','guarichas',
    'guisa','guisas','guisaso','guisasa',
    'culipronta','culiprontas',
    'lacra','lacras',
    'sapo hijueputa','sapa hijueputa',
    'pirobo hijueputa','piroba hijueputa',
    'cacorro hijueputa',
    'malparido hijueputa',
    'gonorrea hijueputa',
    'desgraciado','desgraciada','desgraciados','desgraciadas',
    'lambón','lambon','lambona','lambones',
    'chupamedias','chupamedia',
    'perrazas','perraza',
    'putazo','putazos',
    'hijuepuercas','hijuepuerco','hijuepuerca',
    'perra malparida','perro malparido',
    'perra hijueputa','perro hijueputa',
    'zorra malparida',
    'come mierda','comemierda','comemierdas',
    'come verga','comeverga','comevergas',
    'come culo','comeculo',
    'nacido por el chiquito','nacida por el chiquito',
    'parido por el chiquito','parida por el chiquito',
    'salido por el chiquito','salida por el chiquito',
    // Nota: "enfermo/enferma", "sida", "down" se eliminaron porque son términos
    // médicos/comunes que generan falsos positivos ("estoy enfermo", "el sistema está down").
    // Si aparecen como insulto siempre van con otras palabras ofensivas detectables.
    // insultos a discapacidad / condición
    'mongoloide','mongolo','mongola',
    'mogólico','mogolico','mogolica',
    'retrasado mental','retrasada mental',
    'sindrome de down',
    'encefalograma plano',
    'cerebro de mosquito',
    // Colombia costeño / regional
    'guevon','guevona','guevas',
    'costeño gonorrea',
    'paisa hijueputa',
    'rolo hijueputa',
    'caquero','caquera',
    'tierrero','tierrera',
    'ñero','ñera','ñeros','ñeras',
    'ñeroñero',
    'gamín','gamin','gamines',
    // Compuestos y frases ofensivas colombianas
    'sapo malparido','sapo hijueputa',
    'perra cuentera','perro cuentero',
    'vieja perra','viejo perro',
    'vieja puta','viejo puto',
    'vieja gonorrea','viejo gonorrea',
    'hp malparido','hp hijueputa',
    'cara de culo','cara de pinga','cara de verga',
    'cara de malparido','cara de malparida',
    'hijo de puta','hija de puta',
    'hijo de la gran puta','hija de la gran puta',
    'hijodeputa','hijadelagranputa','hijodelagranputa',
    'se la mamo','se la mama','mamela',
    'mamela bien','mamelo bien',
    'vayase a la mierda','vete a la mierda','váyase a la verga',
    'metasela','metesela',
    'que se meta','metelo',
    'pirobaso','pirobaza',
    'gonorreazo','gonorreaza',
    'pircuche','pircucho',
    // Variantes leetspeak / evasión adicionales
    'p3rra','p3rro','put4','put0','m4lp4rid0','m4lp4rid4',
    'hjp','hjpt','cul0','cul00',
    'p3nd3jo','p3ndejo',
    'v3rga','v3rg4',
    'g0norrea','g0norre4',
    'h1jueputa',
    // Español - México
    'no mames','no mamar','wey pendejo','guey','putazo','chingar','chingón','chingon',
    'chingadera','chingao','verguiza','culiada','culiad0','culiar','mms','cabron',
    // Español - Argentina / Uruguay
    'boludo','boluda','pelotudo','pelotuda','forro','concha','conchudo',
    'la puta madre','ortiva','mogólico','mogolico',
    // Español - España
    'subnormal','capullo','cojones','me cago en','me cago','zorra','pringado','gilipollas',
    // Otros español LATAM
    'huevón','huevon','weona','aweonao','aweonado',
    'ctm','conchatumadre','concha tu madre',
    'pajero','pajera','maraco','culiao','culiada',
    // Inglés (frecuentes)
    'fuck','fucking','shit','bullshit','ass','asshole','bitch','bastard',
    'damn','crap','dick','cock','pussy','whore','slut','motherfucker',
    'mf','stfu','gtfo','son of a bitch','sob','dumbass','jackass',
    // Slurs / muy ofensivas
    'nigger','nigga','faggot','retard','tranny','cunt',
    // Variantes leetspeak / evasión
    'f*ck','f**k','sh1t','b1tch','4ss','a55','d1ck','c0ck',
    'p*ta','p*t*','m13rda','m1erda','put4','put0','cul0','cvl0',
];

/**
 * Palabras que SOLO se detectan con word boundary estricto.
 * Reducidas al mínimo para evitar falsos positivos con palabras comunes:
 * - "ano" bloqueaba "año", "piano", "soberano", "hermano"
 * - "gay", "sida", "enfermo", "pito", "down" son términos cotidianos
 * Se mantienen solo palabras que son inequívocamente problemáticas en cualquier contexto.
 */
const PALABRAS_BOUNDARY_ESTRICTO = [
    'cp','suicidar','suicidio','matar',
    'porn','mrk','mk','mrd',
];

/**
 * Palabras que se detectan incluso como parte de otras palabras (substring).
 * Ejemplo: "tengopene", "/npene".
 * Se filtran mediante SAFE_WORDS para evitar falsos positivos.
 */
const PALABRAS_SUBSTRING = [
    // Se mantiene aquí también para detectar 'tengopene', etc.
    'pene',
];


/**
 * Whitelist de palabras seguras que contienen substrings ofensivos pero son válidas.
 * Se comparan contra el texto procesado (sin tildes, colapsado).
 */
const SAFE_WORDS = [
    'desempene', 'desempenes', 'desempenen', 'desempenar', 'desempeno',
    'penelope',
    'piano', 'soberano', 'hermano', 'mano', 'verano', 'temprano', 'pantano', 'fulano', 'enano',
    'apnea', 'repentino', 'coseno', 
];


// ─────────────────────────────────────────────────────────────────────────────
// 🔹 LEET MAP extendido
// ─────────────────────────────────────────────────────────────────────────────
const LEET_MAP = {
    '4': 'a', '@': 'a', 'á': 'a', 'à': 'a', 'ä': 'a',
    '3': 'e', '€': 'e', 'é': 'e', 'è': 'e',
    '1': 'i', '!': 'i', 'í': 'i', 'ì': 'i', 'ï': 'i',
    '0': 'o', 'ó': 'o', 'ò': 'o', 'ö': 'o',
    '$': 's', '5': 's',
    '7': 't',
    '+': 't',
    '(': 'c',
    'ñ': 'n',
    'ü': 'u', 'ú': 'u', 'ù': 'u',
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔹 Normalización multicapa
// ─────────────────────────────────────────────────────────────────────────────
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}
function normalizarLeet(texto) {
    return texto.split('').map(c => LEET_MAP[c] ?? c).join('');
}
/**
 * Colapsa letras repetidas 3+ veces a 2: "perrraaa" → "perra", "puuuta" → "puuta"
 */
function colapsarRepetidas(texto) {
    return texto.replace(/(.)\1{2,}/g, '$1$1');
}
function normalizarUsername(username) {
    let u = username.replace(/[.\-_\s]/g, '');
    u = u.replace(/\d+/g, '');
    return u;
}
/**
 * CORREGIDO: elimina caracteres especiales (/, *, #, . etc.) reemplazándolos
 * por espacio, y colapsa espacios múltiples resultantes.
 * Resuelve casos como "/npene" → "npene" y "p*ta" → "p ta".
 */
function limpiarTexto(texto) {
    let limpio = texto.replace(/[^a-z0-9\s]/g, ' ');
    return limpio.replace(/\s+/g, ' ').trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔹 Pipelines de normalización
// ─────────────────────────────────────────────────────────────────────────────

/** Pipeline completo para texto libre */
function procesarTexto(texto) {
    let t = normalizarTexto(texto);
    t = normalizarLeet(t);
    t = colapsarRepetidas(t);
    t = limpiarTexto(t);
    return t;
}
/** Pipeline para username de correo */
function procesarUsername(username) {
    let u = normalizarTexto(username);
    u = normalizarLeet(u);
    u = colapsarRepetidas(u);
    u = normalizarUsername(u);
    return u;
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔹 Construcción del regex
// ─────────────────────────────────────────────────────────────────────────────
function escaparRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const SEP = `[\\s.,\\-_"'!¡¿?]*`;
function expandirSeparadores(palabra) {
    return palabra.split('').join(SEP);
}
function pluralizar(p) {
    return [p, `${p}s`, `${p}es`];
}

/**
 * Genera patrón con repetición de letras: "puta" → "p+u+t+a+"
 * Captura evasiones como "puuuta", "perrra", "mierrrda".
 */
function conRepeticion(palabraNorm) {
    return palabraNorm.split('').map(c => {
        if (/[a-z]/.test(c)) return `${escaparRegex(c)}+`;
        return escaparRegex(c);
    }).join('');
}

/**
 * CORREGIDO: normaliza las palabras de la lista con el MISMO pipeline que el
 * texto de entrada, para que "p*ta" de la lista → "p ta" y matchee "p ta" del input.
 *
 * Cambios respecto a la versión anterior:
 * - Aplica procesarTexto() a cada palabra (no solo normalizarTexto)
 *   → "p*ta" → "p ta", "f*ck" → "f ck", "p.u.t.a" → "p u t a"
 * - Agrega patrón con repetición (p+u+t+a+) → captura "puuuta", "perrrra"
 * - expandirSeparadores para palabras de 3+ chars (antes solo 5+)
 *   → captura "p.u.t.a", "p/e/n/e", "p uta", "p u t a"
 * - Patrón de sufijos ([a-z0-9]*) solo para palabras de 5+ chars
 *   → evita que "sob" (3 chars) matchee "soberano"
 */
function crearPatronesTexto(palabraOriginal, soloExacto = false) {
    const palabraNorm = procesarTexto(palabraOriginal);
    const base = escaparRegex(palabraNorm);
    const baseRep = conRepeticion(palabraNorm);
    const largoSinEspacios = palabraNorm.replace(/\s/g, '').length;
    const corta = largoSinEspacios <= 2;

    const patrones = new Set([
        `(?<![a-z])${base}(?![a-z])`,
        `(?<![a-z])${baseRep}(?![a-z])`,
        ...pluralizar(base).map(pl => `(?<![a-z])${pl}(?![a-z])`),
    ]);

    if (!corta) {
        // expandirSeparadores para 3+ chars: detecta "p.u.t.a", "p/e/n/e", "p uta"
        patrones.add(`(?<![a-z])${expandirSeparadores(base)}(?![a-z])`);
    }

    if (!corta && !soloExacto && largoSinEspacios >= 5) {
        // Sufijos solo para palabras largas: "malparidos", "putazo", "gilipollas"
        // No para cortas (<5) para evitar "sob" → "soberano"
        patrones.add(`(?<![a-z])${base}[a-z0-9]*(?![a-z])`);
    }

    return [...patrones];
}

function crearPatronesEmail(palabraNorm) {
    const base = escaparRegex(palabraNorm);
    return [base];
}

function crearRegexTexto(lista, listaBoundary, listaSubstring = []) {
    const patronesNormales = lista
        .flatMap(p => crearPatronesTexto(p, false));
    const patronesBoundary = listaBoundary
        .flatMap(p => crearPatronesTexto(p, true));
    const patronesSubstring = listaSubstring
        .flatMap(p => {
            const base = escaparRegex(procesarTexto(p));
            return [base, ...pluralizar(base)];
        });

    return new RegExp([
        ...patronesNormales,
        ...patronesBoundary,
        ...patronesSubstring
    ].join('|'), 'i');
}


function crearRegexEmail(lista, listaBoundary) {
    const patronesNormales = lista
        .map(p => normalizarTexto(p).replace(/\s/g, ''))
        .filter(p => p.length >= 2)
        .flatMap(crearPatronesEmail);
    const patronesBoundary = listaBoundary
        .map(p => normalizarTexto(p).replace(/\s/g, ''))
        .filter(p => p.length >= 2)
        .flatMap(p => [`(?<![a-z])${escaparRegex(p)}(?![a-z])`]);
    return new RegExp([...patronesNormales, ...patronesBoundary].join('|'), 'i');
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔹 Hook principal
// ─────────────────────────────────────────────────────────────────────────────
export function useOfensiveValidator() {
    const regexTexto = useMemo(
        () => crearRegexTexto(PALABRAS_OFENSIVAS, PALABRAS_BOUNDARY_ESTRICTO, PALABRAS_SUBSTRING),
        []
    );
    const regexEmail = useMemo(
        () => crearRegexEmail(PALABRAS_OFENSIVAS, [...PALABRAS_BOUNDARY_ESTRICTO, ...PALABRAS_SUBSTRING]),
        []
    );


    function contieneOfensivas(texto) {
        return regexTexto.test(procesarTexto(texto));
    }

    function contieneOfensivasEmail(username) {
        return regexEmail.test(procesarUsername(username));
    }

    function obtenerOfensivas(texto) {
        return procesarTexto(texto).match(regexTexto) || [];
    }

    /**
     * Limpia el texto eliminando espacios redundantes antes de enviarlo.
     * Llamar antes de enviar el mensaje al backend.
     */
    function limpiarMensaje(texto) {
        return texto.replace(/\s+/g, ' ').trim();
    }

    function validar(texto) {
        const textoProc = procesarTexto(texto);
        const matches = [...textoProc.matchAll(new RegExp(regexTexto.source, 'gi'))];

        if (matches.length > 0) {
            // Filtrar matches contra SAFE_WORDS
            const ofensivasReales = matches.filter(match => {
                const palabraEncontrada = match[0];
                const index = match.index;

                // Encontrar la palabra completa en el texto procesado que contiene el match
                const inicioPalabra = textoProc.lastIndexOf(' ', index) + 1;
                let finPalabra = textoProc.indexOf(' ', index + palabraEncontrada.length);
                if (finPalabra === -1) finPalabra = textoProc.length;

                const palabraCompleta = textoProc.substring(inicioPalabra, finPalabra);

                // Si la palabra completa está en SAFE_WORDS, ignoramos este match
                return !SAFE_WORDS.includes(palabraCompleta);
            }).map(m => m[0]);

            if (ofensivasReales.length > 0) {
                return { valido: false, palabras: ofensivasReales, mensaje: 'Tu mensaje contiene lenguaje ofensivo' };
            }
        }

        const colapsado = textoProc.replace(/[\s.,\-_'"!¡¿?0-9]/g, '');
        const matchColapsado = colapsado.match(regexEmail) || [];
        if (matchColapsado.length > 0) {
            // Para el modo colapsado es más difícil filtrar safe words,
            // pero podemos intentar ver si el match es parte de una safe word también
            const realesCol = matchColapsado.filter(p => !SAFE_WORDS.some(safe => safe.includes(p)));
            if (realesCol.length > 0) {
                return { valido: false, palabras: realesCol, mensaje: 'Tu mensaje contiene lenguaje ofensivo' };
            }
        }
        return { valido: true, palabras: [], mensajeLimpio: limpiarMensaje(texto) };
    }


    function validarEmail(email) {
        if (!email || !email.includes('@')) return { valido: true };

        const [username, domainFull] = email.split('@');

        // Revisar username (parte antes del @)
        if (username && contieneOfensivasEmail(username)) {
            return { valido: false, mensaje: 'El correo contiene términos no permitidos' };
        }

        // Revisar cada segmento del dominio (ej: "pene.com" → ["pene", "com"])
        if (domainFull) {
            const partesDominio = domainFull.split('.');
            for (const parte of partesDominio) {
                if (parte && contieneOfensivasEmail(parte)) {
                    return { valido: false, mensaje: 'El correo contiene términos no permitidos' };
                }
            }
        }

        return { valido: true };
    }

    return {
        contieneOfensivas,
        contieneOfensivasEmail,
        obtenerOfensivas,
        validar,
        validarEmail,
        limpiarMensaje,
    };
}
// ─────────────────────────────────────────────────────────────────────────────
// 🔹 Reglas de validación por campo
// ─────────────────────────────────────────────────────────────────────────────

// La validación de mensaje se inyecta dinámicamente con el hook (ver abajo)
const BASE_VALIDATIONS = {
    name: {
        filter: /[^a-zA-ZÀ-ÿñÑüÜ\s]/g,
        validate: (v) => {
            const letras = v.replace(/\s/g, '');
            if (!v.trim())         return 'El nombre es obligatorio.';
            if (letras.length < 3) return 'El nombre debe tener al menos 3 letras.';
            if (/\s{2,}/.test(v))  return 'No uses espacios dobles en el nombre.';
            return '';
        },
    },
    email: {
        filter: null,
        validate: (v) => {
            if (!v.trim()) return 'El correo es obligatorio.';
            const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
            if (!re.test(v)) return 'Ingresa un correo válido (ej: nombre@gmail.com).';
            return '';
        },
    },
    message: {
        // Bloqueo total de emojis (modernos y clásicos), símbolos pictográficos, 
        // flechas, estrellas y formas geométricas.
        filter: /[<>{}[\]\\`\p{Extended_Pictographic}\u{2190}-\u{21FF}\u{2600}-\u{2BFF}\u{1F1E6}-\u{1F1FF}]/gu,
        // validate se completa dentro del componente usando el hook
    },
};

const applyFilter = (field, value) => {
    const rule = BASE_VALIDATIONS[field];
    if (rule?.filter) return value.replace(rule.filter, '');
    return value;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔹 Componente de error inline
// ─────────────────────────────────────────────────────────────────────────────

function FieldError({ msg }) {
    return (
        <AnimatePresence>
            {msg && (
                <motion.span
                    key={msg}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-1 text-xs text-red-600 font-medium mt-0.5"
                >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {msg}
                </motion.span>
            )}
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔹 Componente principal
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactForm() {
    const { usuario, estaAutenticado } = useAuth();
    const { validar, validarEmail } = useOfensiveValidator();

    const user = estaAutenticado && usuario ? {
        id:    usuario._id || usuario.id || null,
        name:  usuario.nombre || usuario.name || '',
        email: usuario.email || '',
    } : null;

    const [formData, setFormData] = useState({
        name: '', email: '', subject: '', message: '',
    });

    const [fieldErrors, setFieldErrors] = useState({
        name: '', email: '', subject: '', message: '',
    });

    const [touched, setTouched] = useState({
        name: false, email: false, subject: false, message: false,
    });

    const [isLoading,   setIsLoading]   = useState(false);
    const [isSuccess,   setIsSuccess]   = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [showEmailOfensivoModal, setShowEmailOfensivoModal] = useState(false);

    // ── Sincronizar sesión ────────────────────────────────────────────────────
    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
        } else {
            setFormData(prev => ({ ...prev, name: '', email: '' }));
        }
    }, [estaAutenticado]);

    // ── Validar campo — ahora es una función pura que devuelve el error ────────
    const validateField = (name, value) => {
        if (name === 'subject') return value ? '' : 'Selecciona un asunto.';

        // 🔹 Validaciones base (formato/requerido)
        if (name !== 'message' && name !== 'subject') {
            const rule = BASE_VALIDATIONS[name];
            const error = rule ? rule.validate(value) : '';
            if (error) return error;
        }

        // 🔥 Validación de ofensivas para Nombre y Mensaje
        if (name === 'name' || name === 'message') {
            const resultado = validar(value);
            if (!resultado.valido) {
                return 'Tu mensaje contiene lenguaje no permitido.';
            }
        }

        // 🔥 Validación de ofensivas para Email
        if (name === 'email') {
            const resultado = validarEmail(value);
            if (!resultado.valido) {
                return resultado.mensaje;
            }
        }

        // 🔹 Validación de longitud y contenido para Mensaje
        if (name === 'message') {
            if (!value.trim()) return 'El mensaje es obligatorio.';
            if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
            
            // Backup: Detectar restos de emojis o símbolos no permitidos
            const hasEmojis = /[\p{Extended_Pictographic}\u{2190}-\u{21FF}\u{2600}-\u{2BFF}]/u.test(value);
            if (hasEmojis) return 'No se permiten emojis ni símbolos especiales.';
        }

        return '';
    };

    // ── Cambio de valor ───────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (user && (name === 'name' || name === 'email')) return;

        let filtered = applyFilter(name, value);

        // 🔥 Email: filtrar emojis
        if (name === 'email') {
            filtered = filtered.replace(/[^\x20-\x7E]/g, '');
        }

        setFormData(prev => ({ ...prev, [name]: filtered }));
        setSubmitError('');

        // 🔥 Validación en tiempo real
        if (name === 'name' || name === 'email') {
            const err = validateField(name, filtered);
            // Si el error es por lenguaje ofensivo, mostrarlo siempre.
            // Si es por formato (ej: email incompleto), mostrarlo solo si ya fue tocado.
            const isOfensive = err.includes('no permitido') || err.includes('términos no permitidos');
            if (isOfensive || touched[name]) {
                setFieldErrors(prev => ({ ...prev, [name]: err }));
            } else {
                setFieldErrors(prev => ({ ...prev, [name]: '' }));
            }

            // 🔥 Modal de palabras ofensivas para email en tiempo real
            if (name === 'email' && isOfensive) {
                setShowEmailOfensivoModal(true);
            } else if (name === 'email' && !isOfensive) {
                setShowEmailOfensivoModal(false);
            }
        } else if (name === 'message') {
            const err = validateField('message', filtered);
            const isOfensive = err.includes('no permitido');
            if (isOfensive || touched.message) {
                setFieldErrors(prev => ({ ...prev, message: err }));
            } else {
                setFieldErrors(prev => ({ ...prev, message: '' }));
            }
        } else if (touched[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: validateField(name, filtered) }));
        }
    };

    // ── Blur → marcar campo ───────────────────────────────────────────────────
    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (user && (name === 'name' || name === 'email')) return;
        setTouched(prev => ({ ...prev, [name]: true }));
        setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    // ── Validar todo antes de enviar ──────────────────────────────────────────
    const validateAll = () => {
        const errors = {
            name:    user ? '' : validateField('name',    formData.name),
            email:   user ? '' : validateField('email',   formData.email),
            subject: validateField('subject', formData.subject),
            message: validateField('message', formData.message),
        };
        setFieldErrors(errors);
        setTouched({ name: true, email: true, subject: true, message: true });
        return Object.values(errors).every(e => e === '');
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateAll()) return;

        setIsLoading(true);
        setSubmitError('');

        try {
            const body = {
                name:    formData.name.trim(),
                email:   formData.email.trim(),
                subject: formData.subject,
                message: formData.message.trim(),
                userId:  user?.id || null,
            };

            const res  = await fetch('/api/contact', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(body),
            });

            const data = await res.json();

            if (data.success) {
                setIsSuccess(true);
                setFormData(prev => ({
                    name:    user ? prev.name  : '',
                    email:   user ? prev.email : '',
                    subject: '',
                    message: '',
                }));
                setTouched({ name: false, email: false, subject: false, message: false });
                setFieldErrors({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setIsSuccess(false), 6000);
            } else {
                setSubmitError(data.mensaje || 'Error al enviar el mensaje.');
            }
        } catch {
            setSubmitError('Error de conexión. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    // ── Estilos ───────────────────────────────────────────────────────────────
    const inputBase = (hasError) =>
        'w-full px-4 py-3 rounded-xl border-2 ' +
        (hasError
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 '
            : 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 ') +
        'outline-none transition-all bg-white/50 text-green-900 placeholder-green-400';

    const inputReadOnly =
        'w-full px-4 py-3 rounded-xl border-2 border-green-200 bg-green-50/70 ' +
        'text-green-800 cursor-not-allowed select-none outline-none';

    const showErr = (field) => touched[field] ? fieldErrors[field] : '';

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <ViewportMotion direction="left">
            <div className="glass-card rounded-3xl p-8 md:p-10 shadow-xl bg-white/60 border-2 border-green-300">

                {/* Cabecera */}
                <h2 className="text-2xl flex gap-2 items-center justify-center md:justify-start md:text-3xl font-bold text-green-900 mb-2">
                    <SendHorizonal className="w-6 h-6 inline" />
                    Envíanos un mensaje
                </h2>
                <p className="text-green-600 mb-1 text-center md:text-left">
                    Completa el formulario y te responderemos lo antes posible.
                </p>

                {/* Badge sesión */}
                <div className="mb-6 flex justify-center md:justify-start">
                    {user ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                                         bg-green-100 text-green-700 border border-green-300
                                         px-3 py-1 rounded-full">
                            <User className="w-3.5 h-3.5" />
                            Enviando como {user.name}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                                         bg-amber-50 text-amber-700 border border-amber-300
                                         px-3 py-1 rounded-full">
                            <User className="w-3.5 h-3.5" />
                            Enviando como invitado
                        </span>
                    )}
                </div>

                {/* Banner éxito */}
                <AnimatePresence>
                    {isSuccess && (
                        <motion.div key="success" initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 rounded-xl bg-green-100 border border-green-300 flex items-center gap-3"
                        >
                            <CheckCircle className="w-6 h-6 text-green-700 shrink-0" />
                            <div>
                                <p className="font-semibold text-green-900">¡Mensaje enviado!</p>
                                <p className="text-sm text-green-700">Recibimos tu mensaje. Te responderemos pronto.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Banner error de envío */}
                <AnimatePresence>
                    {submitError && (
                        <motion.div key="submitError" initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <p className="text-sm text-red-700 font-medium">{submitError}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Formulario */}
                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                    {/* Nombre y Correo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        {/* Nombre */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-green-800 flex items-center justify-between gap-1">
                                <span className="flex items-center gap-1">
                                    Nombre
                                    {user && <Lock className="w-3 h-3 text-green-400" title="Autocompletado con tu cuenta" />}
                                </span>
                                {!user && fieldErrors.name === 'Tu nombre contiene lenguaje no permitido.' && (
                                    <span className="text-xs font-semibold text-red-500">⚠ Lenguaje no permitido</span>
                                )}
                            </span>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Tu nombre completo"
                                required
                                readOnly={!!user}
                                className={user ? inputReadOnly : inputBase(!!showErr('name'))}
                            />
                            <FieldError msg={showErr('name')} />
                        </div>

                        {/* Correo */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-green-800 flex items-center justify-between gap-1">
                                <span className="flex items-center gap-1">
                                    Correo
                                    {user && <Lock className="w-3 h-3 text-green-400" title="Autocompletado con tu cuenta" />}
                                </span>
                                {!user && fieldErrors.email === 'El correo contiene términos no permitidos' && (
                                    <span className="text-xs font-semibold text-red-500">⚠ Correo no permitido</span>
                                )}
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="tu@email.com"
                                required
                                readOnly={!!user}
                                className={user ? inputReadOnly : inputBase(!!showErr('email'))}
                            />
                            <FieldError msg={showErr('email')} />
                        </div>

                    </div>

                    {/* Asunto */}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-green-800">Asunto</span>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className={inputBase(!!showErr('subject'))}
                        >
                            <option value="">Selecciona un asunto</option>
                            <option value="general">Consulta general</option>
                            <option value="support">Soporte técnico</option>
                            <option value="suggestion">Sugerencia</option>
                            <option value="partnership">Colaboración</option>
                        </select>
                        <FieldError msg={showErr('subject')} />
                    </div>

                    {/* Mensaje */}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-green-800 flex justify-between items-center">
                            <span className="flex items-center gap-2">
                                Mensaje
                                <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1 select-none">
                                    <ShieldAlert className="w-2.5 h-2.5" />
                                    Sin emojis
                                </span>
                            </span>
                            <span className={`text-xs font-normal transition-colors ${
                                fieldErrors.message === 'Tu mensaje contiene lenguaje no permitido.'
                                    ? 'text-red-500 font-semibold'
                                    : formData.message.length === 0
                                        ? 'text-green-300'
                                        : formData.message.length < 10
                                            ? 'text-red-400'
                                            : 'text-green-500'
                            }`}>
                                {fieldErrors.message === 'Tu mensaje contiene lenguaje no permitido.'
                                    ? '⚠ Lenguaje no permitido'
                                    : `${formData.message.length} car.${formData.message.length >= 10 ? ' ✓' : ' (mín. 10)'}`
                                }
                            </span>
                        </span>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={5}
                            placeholder="¿En qué podemos ayudarte?"
                            required
                            className={`${inputBase(!!fieldErrors.message)} resize-none`}
                        />
                        <FieldError msg={fieldErrors.message} />
                    </div>

                    <SendButton isLoading={isLoading} isSuccess={isSuccess} />
                </form>

                {/* ── Modal: correo con palabras ofensivas ──────────────────────── */}
                <AnimatePresence>
                    {showEmailOfensivoModal && (
                        <motion.div
                            key="email-ofensivo-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
                            onClick={() => setShowEmailOfensivoModal(false)}
                        >
                            <motion.div
                                key="email-ofensivo-modal"
                                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85, y: 30 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Gradient header */}
                                <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                                        className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 shadow-lg"
                                    >
                                        <ShieldAlert className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-white">Correo no permitido</h3>
                                    <p className="text-sm text-red-100 mt-1">Se detectó contenido inapropiado</p>
                                </div>

                                {/* Body */}
                                <div className="p-6">
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 mb-5">
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-red-800">Lenguaje ofensivo detectado</p>
                                            <p className="text-xs text-red-600 mt-1">
                                                El correo electrónico que ingresaste contiene términos que no están permitidos
                                                en nuestra plataforma. Por favor, usa un correo electrónico válido y apropiado.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowEmailOfensivoModal(false)}
                                        className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-red-500/25 transition-all active:scale-[0.98] cursor-pointer"
                                    >
                                        Entendido, corregir correo
                                    </button>
                                </div>

                                {/* Close button */}
                                <button
                                    type="button"
                                    onClick={() => setShowEmailOfensivoModal(false)}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </ViewportMotion>
    );
}