import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, SendHorizonal, AlertCircle, User, Lock } from "lucide-react";
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
    'chimba','chimbo','pene','vagina','pelado marica','hpta','hijpta',
    'mk','mka','marik','marika','mar1ca','mar!ca','hptas','maricones','tetranutras','tetranutra',
    'sapas','penes', 'porno','pornografía','xvideos','porn hub','pornhub', 'mlp','tragaleche','culean',
    'soplamonda', 'pichaslargas','culear', 'culito', 'mia khalifa','ano', 'polla', 'zunga', 'sunga', 'soplapicha',
    'consolador','mal parido','malparido', 'malparidos','becerro', 'virgen','mrd', 'qulo','kulo','teta','chocho',
    'pendejo', 'pendejos', 'gay','cacorro','veneco', 'veneca','venequito', 'chamo', 'beneco','chocha', 'cachon', 'cachondo',
    'cachocontento','carepicha', 'monda', 'viril', 'viriles', 'cuca', 'picha', 'cabezaepicha', 'pta', 'catrehijuepta','vrg','vrgs',
    'semen', 'cervical', 'qlo', 'arrecha','zemen', 'arrecho', 'vergones', 'vergotas', 'verguitas', 'brga', 

    // Español - México
    'no mames','no mamar','wey pendejo','guey','putazo','chingar','chingón','chingon',
    'chingadera','chingao','verguiza','culiada','culiad0','culiar',
    // Español - Argentina / Uruguay
    'boludo','boluda','pelotudo','pelotuda','forro','concha','conchudo',
    'la puta madre','ortiva','mogólico','mogolico',
    // Español - España
    'subnormal','capullo','cojones','me cago en','me cago','zorra','pringado',
    // Otros español LATAM
    'huevón','huevon','weon','weona','aweonao','aweonado',
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

// ─────────────────────────────────────────────────────────────────────────────
// 🔹 LEET MAP extendido (cubre más variantes de evasión)
// ─────────────────────────────────────────────────────────────────────────────
const LEET_MAP = {
    '4': 'a', '@': 'a',  'á': 'a', 'à': 'a', 'ä': 'a',
    '3': 'e', '€': 'e',  'é': 'e', 'è': 'e',
    '1': 'i', '!': 'i',  'í': 'i', 'ì': 'i', 'ï': 'i',
    '0': 'o', 'ó': 'o',  'ò': 'o', 'ö': 'o',
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

/** 1. Minúsculas + quitar diacríticos Unicode */
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/** 2. Sustituir caracteres leet por letras */
function normalizarLeet(texto) {
    return texto.split('').map(c => LEET_MAP[c] ?? c).join('');
}

/**
 * 3. Para correos: limpiar separadores internos típicos usados como evasión.
 *    pene.77 → pene77 → pene   |   p_e_n_e → pene
 *    Se eliminan puntos, guiones, guiones bajos y dígitos ENTRE letras.
 */
function normalizarUsername(username) {
    // a) quitar separadores (., -, _, espacios)
    let u = username.replace(/[.\-_\s]/g, '');
    // b) quitar dígitos que "separan" bloques de letras
    //    p.ej.  pene77  → pene  |  p3n3 ya fue manejado por leet
    u = u.replace(/\d+/g, '');
    return u;
}

/** 4. Limpiar el texto libre (mensajes / nombres): conservar letras y espacios */
function limpiarTexto(texto) {
    return texto.replace(/[^a-z0-9\s.,\-_"'!¡¿?]/g, ' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔹 Construcción del regex
// ─────────────────────────────────────────────────────────────────────────────

function escaparRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Separadores universales entre letras (para textos libres) */
const SEP = `[\\s.,\\-_"'!¡¿?]*`;

/** Expande "puta" → "p[SEP]u[SEP]t[SEP]a" para detectar p.u.t.a */
function expandirSeparadores(palabra) {
    return palabra.split('').join(SEP);
}

/** Plurales simples */
function pluralizar(p) {
    return [p, `${p}s`, `${p}es`];
}

/**
 * Genera patrones para texto libre (nombres / mensajes):
 *  - word boundary exacto
 *  - plurales
 *  - pegado con sufijo (\w*)
 *  - con separadores entre letras
 *
 * IMPORTANTE: para palabras cortas (≤4 letras) se usa boundary estricto
 * para evitar falsos positivos ("ano" en "piano", "ass" en "lass", etc.)
 */
function crearPatronesTexto(palabraNorm) {
    const base = escaparRegex(palabraNorm);
    const corta = palabraNorm.replace(/\s/g, '').length <= 4;

    const patrones = [
        // Exacto con boundary
        `(?<![a-z])${base}(?![a-z])`,
        // Plurales
        ...pluralizar(base).map(pl => `(?<![a-z])${pl}(?![a-z])`),
    ];

    if (!corta) {
        // Pegado con cualquier sufijo alfanumérico
        patrones.push(`(?<![a-z])${base}[a-z0-9]*(?![a-z])`);
        // Separado con símbolos entre letras
        patrones.push(expandirSeparadores(base));
    }

    return patrones;
}

/**
 * Para USERNAME de correo se usa un regex más agresivo:
 * detecta la palabra ofensiva como SUBCADENA (sin boundary) porque el
 * username ya fue normalizado (sin dígitos ni separadores).
 */
function crearPatronesEmail(palabraNorm) {
    const base = escaparRegex(palabraNorm);
    // Subcadena directa — el username limpio no tiene separadores ni dígitos
    return [base];
}

function crearRegexTexto(lista) {
    const patrones = lista
        .map(p => normalizarTexto(p))
        .flatMap(crearPatronesTexto);
    return new RegExp(patrones.join('|'), 'i');
}

function crearRegexEmail(lista) {
    const patrones = lista
        .map(p => normalizarTexto(p).replace(/\s/g, ''))   // sin espacios
        .filter(p => p.length >= 2)                         // descartar muy cortas
        .flatMap(crearPatronesEmail);
    return new RegExp(patrones.join('|'), 'i');
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔹 Hook principal
// ─────────────────────────────────────────────────────────────────────────────

export function useOfensiveValidator() {

    // Dos regex distintos: uno para texto libre, otro para usernames de email
    const regexTexto = useMemo(() => crearRegexTexto(PALABRAS_OFENSIVAS), []);
    const regexEmail = useMemo(() => crearRegexEmail(PALABRAS_OFENSIVAS), []);

    /** Pipeline de normalización para texto libre */
    function procesarTexto(texto) {
        let t = normalizarTexto(texto);
        t = normalizarLeet(t);
        t = limpiarTexto(t);
        return t;
    }

    /** Pipeline de normalización para username de email */
    function procesarUsername(username) {
        let u = normalizarTexto(username);
        u = normalizarLeet(u);
        u = normalizarUsername(u);   // ← elimina separadores y dígitos
        return u;
    }

    function contieneOfensivas(texto) {
        return regexTexto.test(procesarTexto(texto));
    }

    function contieneOfensivasEmail(username) {
        return regexEmail.test(procesarUsername(username));
    }

    function obtenerOfensivas(texto) {
        return procesarTexto(texto).match(regexTexto) || [];
    }

    /** Valida texto libre (nombre / mensaje) — doble pasada para detectar evasión */
    function validar(texto) {
        // Pasada 1: texto con separadores (detecta p.u.t.a, h i j u e p u t a)
        const ofensivas = obtenerOfensivas(texto);
        if (ofensivas.length > 0) {
            return { valido: false, palabras: ofensivas, mensaje: 'Tu mensaje contiene lenguaje ofensivo' };
        }
        // Pasada 2: texto colapsado (sin dígitos ni separadores) para evasión tipo mierda123
        const colapsado = procesarTexto(texto).replace(/[\s.,\-_'"!¡¿?0-9]/g, '');
        const match = colapsado.match(regexEmail) || [];
        if (match.length > 0) {
            return { valido: false, palabras: match, mensaje: 'Tu mensaje contiene lenguaje ofensivo' };
        }
        return { valido: true, palabras: [] };
    }

    /** Valida username de correo electrónico */
    function validarEmail(email) {
        const username = email.split('@')[0];
        if (!username) return { valido: true };
        const encontrado = contieneOfensivasEmail(username);
        if (!encontrado) return { valido: true };
        return {
            valido: false,
            mensaje: 'El correo contiene términos no permitidos',
        };
    }

    return { contieneOfensivas, contieneOfensivasEmail, obtenerOfensivas, validar, validarEmail };
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
        filter: /[<>{}\[\]\\`]/g,
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

    // ── Sincronizar sesión ────────────────────────────────────────────────────
    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
        } else {
            setFormData(prev => ({ ...prev, name: '', email: '' }));
        }
    }, [estaAutenticado]);

    // ── Validar campo — incluye hook de ofensivas para mensaje ────────────────
    const validateField = (name, value) => {
        if (name === 'subject') return value ? '' : 'Selecciona un asunto.';

        // 🔹 Validaciones base primero
        if (name !== 'message') {
            const rule = BASE_VALIDATIONS[name];
            const error = rule ? rule.validate(value) : '';
            if (error) return error;
        }

        // 🔹 Validación de mensaje
        if (name === 'message') {
            if (!value.trim()) return 'El mensaje es obligatorio.';
            if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
        }

        // 🔥 VALIDACIÓN DE OFENSIVAS

        // 📧 Email → validación de username con pipeline especializado
        if (name === 'email') {
            const resultado = validarEmail(value);
            if (!resultado.valido) {
                return resultado.mensaje;
            }
            return '';
        }

        // 👤 Nombre y mensaje completos
        if (name === 'name' || name === 'message') {
            const resultado = validar(value);
            if (!resultado.valido) {
                return 'Tu mensaje contiene lenguaje no permitido.';
            }
        }

        return '';
    };

    // ── Cambio de valor ───────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (user && (name === 'name' || name === 'email')) return;
        const filtered = applyFilter(name, value);
        setFormData(prev => ({ ...prev, [name]: filtered }));
        setSubmitError('');

        // 🔥 Mensaje: validación en tiempo real solo para lenguaje ofensivo
        // El error de longitud mínima se muestra solo al hacer blur
        if (name === 'message') {
            const resultado = validar(filtered);
            if (!resultado.valido) {
                setFieldErrors(prev => ({ ...prev, message: 'Tu mensaje contiene lenguaje no permitido.' }));
            } else if (touched.message) {
                // Si ya tocó el campo, mostrar todos los errores normalmente
                setFieldErrors(prev => ({ ...prev, message: validateField('message', filtered) }));
            } else {
                // Mientras escribe sin haber salido del campo, limpiar errores de longitud
                setFieldErrors(prev => ({ ...prev, message: '' }));
            }
            return;
        }

        if (touched[name]) {
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
                <h2 className="text-2xl flex gap-2 items-center md:text-3xl font-bold text-green-900 mb-2">
                    <SendHorizonal className="w-6 h-6 inline" />
                    Envíanos un mensaje
                </h2>
                <p className="text-green-600 mb-1">
                    Completa el formulario y te responderemos lo antes posible.
                </p>

                {/* Badge sesión */}
                <div className="mb-6">
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
                            <span className="text-sm font-medium text-green-800 flex items-center gap-1">
                                Nombre
                                {user && <Lock className="w-3 h-3 text-green-400" title="Autocompletado con tu cuenta" />}
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
                            <span className="text-sm font-medium text-green-800 flex items-center gap-1">
                                Correo
                                {user && <Lock className="w-3 h-3 text-green-400" title="Autocompletado con tu cuenta" />}
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
                            Mensaje
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

            </div>
        </ViewportMotion>
    );
}