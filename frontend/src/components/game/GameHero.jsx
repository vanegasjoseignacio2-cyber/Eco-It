import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2, Play, Maximize2, Minimize2, RotateCcw, ArrowLeft, Info, ShieldAlert,
    CheckCircle2, Trophy, Star, Settings, X, RefreshCw, ChevronRight
} from 'lucide-react';
import animations from '../animations/Animationgame';
import { guardarPuntajeJuego } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// ── Persistence ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'eco_juego_custom_controls_v2';

// Each control: x/y offset from its CSS home position, scale, opacity
const CTRL_DEFAULT = { x: 0, y: 0, scale: 1.0, opacity: 0.8 };

const DEFAULT_SETTINGS = {
    joystick: { ...CTRL_DEFAULT },
    agarrar:  { ...CTRL_DEFAULT },
    disparar: { ...CTRL_DEFAULT },
    saltar:   { ...CTRL_DEFAULT },
    soltar:   { ...CTRL_DEFAULT },
    arma:     { ...CTRL_DEFAULT },
};

const CONTROL_LABELS = {
    joystick: '🕹 Joystick',
    agarrar:  '✋ Agarrar',
    disparar: '🔫 Disparar',
    saltar:   '⬆ Saltar',
    soltar:   '👇 Soltar',
    arma:     '🔁 Arma',
};

// Margen seguro inferior para que los botones no queden bajo la barra de Safari (iOS).
const safeBottom = (px) => `calc(${px}px + env(safe-area-inset-bottom, 0px))`;

const loadSettings = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge deeply so new keys from CTRL_DEFAULT are always present
            const merged = { ...DEFAULT_SETTINGS };
            for (const key of Object.keys(DEFAULT_SETTINGS)) {
                merged[key] = { ...CTRL_DEFAULT, ...(parsed[key] || {}) };
            }
            return merged;
        }
    } catch (_) { /* ignore */ }
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
};

const saveSettings = (s) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (_) { /* ignore */ }
};

// ── Joystick (outside GameHero to prevent re-mount on state change) ────────────
const Joystick = memo(({ isEditing, opacity, isSelected, onSelect, onDirection }) => {
    const joystickRef = useRef(null);
    const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

    const handleTouch = useCallback((e) => {
        if (isEditing || !joystickRef.current) return;
        const touch = e.touches[0];
        const rect  = joystickRef.current.getBoundingClientRect();
        let dx = touch.clientX - (rect.left + rect.width / 2);
        let dy = touch.clientY - (rect.top  + rect.height / 2);
        const maxR = rect.width / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > maxR) { dx = (dx / dist) * maxR; dy = (dy / dist) * maxR; }
        setKnobPos({ x: dx, y: dy });
        const nx = dx / maxR; const ny = dy / maxR; const t = 0.3;
        onDirection('left', nx < -t); onDirection('right', nx > t);
        onDirection('up',   ny < -t); onDirection('down',  ny > t);
    }, [isEditing, onDirection]);

    const handleTouchEnd = useCallback(() => {
        setKnobPos({ x: 0, y: 0 });
        ['left','right','up','down'].forEach(d => onDirection(d, false));
    }, [onDirection]);

    return (
        <div
            ref={joystickRef}
            onTouchStart={isEditing ? undefined : handleTouch}
            onTouchMove={isEditing ? undefined : handleTouch}
            onTouchEnd={isEditing ? undefined : handleTouchEnd}
            onClick={isEditing ? onSelect : undefined}
            className="w-28 h-28 bg-black/40 border border-white/20 rounded-full relative flex items-center justify-center backdrop-blur-md shadow-2xl select-none touch-none"
            style={{ opacity }}
        >
            {!isEditing && (
                <div
                    style={{
                        transform: `translate(${knobPos.x}px,${knobPos.y}px)`,
                        transition: knobPos.x === 0 && knobPos.y === 0 ? 'transform 0.1s ease-out' : 'none',
                    }}
                    className="w-12 h-12 bg-emerald-500/80 border border-emerald-400 rounded-full shadow-lg pointer-events-none"
                />
            )}
            {isEditing && (
                <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-full border-2 ${isSelected ? 'border-emerald-400 bg-emerald-400/20' : 'border-dashed border-white/40 bg-black/20'}`}>
                    <span className="text-white text-xs font-bold">✥</span>
                    <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-300' : 'text-white/60'}`}>Joystick</span>
                </div>
            )}
        </div>
    );
});

// ── MobileActionButton (outside GameHero) ──────────────────────────────────────
const MobileActionButton = memo(({
    label, keyName, keyCode, colorClass, isMouse = false, mouseButton = 0,
    isEditing, isSelected, opacity, size = 'w-14 h-14',
    onKeyEvent, onMouseEvent, onSelect,
}) => (
    <button
        onPointerDown={(e) => {
            e.preventDefault();
            if (isEditing) { onSelect(); return; }
            isMouse ? onMouseEvent('mousedown', mouseButton) : onKeyEvent(keyName, keyCode, true);
        }}
        onPointerUp={(e) => {
            e.preventDefault();
            if (isEditing) return;
            isMouse ? onMouseEvent('mouseup', mouseButton) : onKeyEvent(keyName, keyCode, false);
        }}
        onPointerLeave={(e) => {
            e.preventDefault();
            if (isEditing) return;
            isMouse ? onMouseEvent('mouseup', mouseButton) : onKeyEvent(keyName, keyCode, false);
        }}
        style={{ opacity }}
        className={`${size} ${colorClass} rounded-full flex flex-col items-center justify-center gap-0.5
            border-2 ${isEditing && isSelected ? 'border-emerald-400' : isEditing ? 'border-white/30 border-dashed' : 'border-white/20'}
            select-none touch-none ${isEditing ? 'cursor-grab' : 'active:scale-95'}
            transition-all backdrop-blur-md shadow-xl text-white font-black text-xs uppercase tracking-wide pointer-events-auto`}
    >
        {isEditing ? (
            <>
                <span className="text-sm">✥</span>
                <span className={`text-[9px] leading-tight ${isEditing && isSelected ? 'text-emerald-300' : 'text-white/60'}`}>{label}</span>
            </>
        ) : label}
    </button>
));

// ── WeaponButton — cicla entre armas 1/2/3 (teclas numéricas) ──────────────────
const WeaponButton = memo(({ weapon, isEditing, isSelected, opacity, onPress, onSelect }) => (
    <button
        onPointerDown={(e) => {
            e.preventDefault();
            if (isEditing) { onSelect(); return; }
            onPress();
        }}
        style={{ opacity }}
        className={`w-14 h-14 bg-violet-600/85 rounded-full flex flex-col items-center justify-center gap-0
            border-2 ${isEditing && isSelected ? 'border-emerald-400' : isEditing ? 'border-white/30 border-dashed' : 'border-white/20'}
            select-none touch-none ${isEditing ? 'cursor-grab' : 'active:scale-95'}
            transition-all backdrop-blur-md shadow-xl text-white pointer-events-auto`}
    >
        {isEditing ? (
            <>
                <span className="text-sm">✥</span>
                <span className={`text-[9px] leading-tight ${isSelected ? 'text-emerald-300' : 'text-white/60'}`}>Arma</span>
            </>
        ) : (
            <>
                <span className="text-[8px] leading-none uppercase font-bold tracking-wide opacity-80">Arma</span>
                <span className="text-lg leading-none font-black">{weapon}</span>
            </>
        )}
    </button>
));

// ── CameraLookPad — zona táctil derecha para mirar/girar la cámara sin disparar ─
const CameraLookPad = memo(({ onLook, onLookEnd }) => {
    const lastRef = useRef(null);

    const handleStart = useCallback((e) => {
        const t = e.touches[0];
        lastRef.current = { x: t.clientX, y: t.clientY };
    }, []);

    const handleMove = useCallback((e) => {
        if (!lastRef.current) return;
        const t = e.touches[0];
        const dx = t.clientX - lastRef.current.x;
        const dy = t.clientY - lastRef.current.y;
        lastRef.current = { x: t.clientX, y: t.clientY };
        if (dx !== 0 || dy !== 0) onLook(dx, dy);
    }, [onLook]);

    const handleEnd = useCallback(() => {
        lastRef.current = null;
        onLookEnd?.();
    }, [onLookEnd]);

    return (
        <div
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            onTouchCancel={handleEnd}
            style={{
                position: 'absolute', top: 0, right: 0, bottom: 0, left: '42%',
                pointerEvents: 'auto', touchAction: 'none',
                background: 'transparent',
            }}
        />
    );
});

// ── ControlEditPanel (outside GameHero) ───────────────────────────────────────
const ControlEditPanel = memo(({ selectedKey, selectedCtrl, onPropChange, onReset, onClose }) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const hasSelection = Boolean(selectedKey);

    if (isMinimized) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-2 left-2 z-35 pointer-events-auto"
            >
                <button
                    onClick={() => setIsMinimized(false)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/95 text-emerald-400 hover:text-white border border-emerald-500/40 transition-all text-xs font-semibold cursor-pointer shadow-2xl backdrop-blur-md"
                >
                    <Settings className="w-3.5 h-3.5 animate-pulse" />
                    <span>Mostrar Controles</span>
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-30 pointer-events-auto"
            style={{ background: 'linear-gradient(to bottom, rgba(2,6,23,0.97) 75%, transparent)' }}
        >
            <div className="px-4 pt-3 pb-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                    <span className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Personalizar Controles
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onReset}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors text-xs font-semibold cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Restablecer todo
                        </button>
                        <button
                            onClick={() => setIsMinimized(true)}
                            title="Contraer panel"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <Minimize2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <p className="text-emerald-700 text-xs mb-3">✦ Cambios guardados automáticamente</p>

                {/* Content */}
                {!hasSelection ? (
                    <div className="flex items-center gap-2 bg-slate-800/60 rounded-xl px-4 py-3">
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        <p className="text-slate-400 text-xs">
                            <span className="text-white font-semibold">Toca un control</span> (✥) para ajustar su tamaño y transparencia individualmente
                        </p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedKey}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                        >
                            {/* Selected control label */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-white font-bold text-sm">
                                    {CONTROL_LABELS[selectedKey]}
                                </span>
                                <span className="text-xs text-emerald-500 bg-emerald-900/40 px-2 py-0.5 rounded-full">Seleccionado</span>
                            </div>

                            {/* Sliders */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                <div>
                                    <label className="text-slate-400 text-xs flex justify-between mb-1">
                                        <span>Transparencia</span>
                                        <span className="text-emerald-400 font-bold">{Math.round(selectedCtrl.opacity * 100)}%</span>
                                    </label>
                                    <input
                                        type="range" min="0.1" max="1" step="0.05"
                                        value={selectedCtrl.opacity}
                                        onChange={(e) => onPropChange('opacity', parseFloat(e.target.value))}
                                        className="w-full h-1.5 accent-emerald-400 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-400 text-xs flex justify-between mb-1">
                                        <span>Tamaño</span>
                                        <span className="text-emerald-400 font-bold">{selectedCtrl.scale.toFixed(1)}×</span>
                                    </label>
                                    <input
                                        type="range" min="0.5" max="2.0" step="0.05"
                                        value={selectedCtrl.scale}
                                        onChange={(e) => onPropChange('scale', parseFloat(e.target.value))}
                                        className="w-full h-1.5 accent-emerald-400 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    );
});

// ── GameHero ───────────────────────────────────────────────────────────────────
const GameHero = ({ onPuntajeGuardado }) => {
    const [isPlaying, setIsPlaying]                 = useState(false);
    const [guardando, setGuardando]                 = useState(false);
    const [resultadoPartida, setResultadoPartida]   = useState(null);
    const [isEditingControls, setIsEditingControls] = useState(false);
    const [selectedControl, setSelectedControl]     = useState(null); // 'joystick'|'agarrar'|'disparar'|'saltar'|'soltar'
    const [controlSettings, setControlSettings]     = useState(loadSettings);
    const [resetKey, setResetKey]                   = useState(0);
    // CSS landscape rotation (works on all mobile browsers incl. iOS Safari)
    const [isLandscapeMode, setIsLandscapeMode]     = useState(false);
    const [isFullscreen, setIsFullscreen]           = useState(false);
    // Detect touch/mobile device dynamically
    const [isTouchDevice, setIsTouchDevice]         = useState(false);
    // Arma seleccionada actualmente (1, 2, 3) para el botón de cambio de arma
    const [currentWeapon, setCurrentWeapon]         = useState(1);

    const iframeContainerRef = useRef(null);
    const iframeRef          = useRef(null);
    const gameWrapperRef     = useRef(null);
    const { estaAutenticado } = useAuth();

    const activeDirections = useRef({ up: false, down: false, left: false, right: false });
    const isEditingRef     = useRef(isEditingControls);
    useEffect(() => { isEditingRef.current = isEditingControls; }, [isEditingControls]);

    // Dynamic touch device detection
    useEffect(() => {
        const checkTouch = () => {
            const hasTouch = 
                typeof window !== 'undefined' && (
                    window.matchMedia('(pointer: coarse)').matches ||
                    ('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0)
                );
            setIsTouchDevice(hasTouch);
        };
        checkTouch();

        const handleTouchStart = () => {
            setIsTouchDevice(true);
            window.removeEventListener('touchstart', handleTouchStart);
        };
        window.addEventListener('touchstart', handleTouchStart);
        return () => window.removeEventListener('touchstart', handleTouchStart);
    }, []);

    // Auto-save on every settings change
    useEffect(() => { saveSettings(controlSettings); }, [controlSettings]);

    // Clear selection when edit panel closes
    useEffect(() => { if (!isEditingControls) setSelectedControl(null); }, [isEditingControls]);

    // Lock body scroll and toggle class while game is in landscape mode
    useEffect(() => {
        if (isLandscapeMode) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('game-landscape-mode');
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('game-landscape-mode');
        }
        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('game-landscape-mode');
        };
    }, [isLandscapeMode]);

    // ── Key / Mouse simulation ─────────────────────────────────────────────────
    const simulateKeyEvent = useCallback((key, keyCode, isKeyDown) => {
        if (!iframeRef.current || isEditingRef.current) return;
        try {
            const doc = iframeRef.current.contentDocument;
            if (!doc) return;
            const canvas = doc.getElementById('unity-canvas');
            const target = canvas || doc;
            let code = key;
            if (key === ' ') code = 'Space';
            else if (key.length === 1 && key >= 'a' && key <= 'z') code = `Key${key.toUpperCase()}`;
            else if (key.length === 1 && key >= 'A' && key <= 'Z') code = `Key${key}`;
            else if (key.length === 1 && key >= '0' && key <= '9') code = `Digit${key}`;
            target.dispatchEvent(new KeyboardEvent(isKeyDown ? 'keydown' : 'keyup', {
                bubbles: true, cancelable: true, key, code, keyCode, which: keyCode,
            }));
        } catch (e) { console.error('simulateKeyEvent', e); }
    }, []);

    // Mueve la cámara enviando un mousemove con deltas (movementX/Y) y posición
    // absoluta acumulada, SIN ningún botón presionado (buttons:0) para que NO dispare.
    const lookPosRef = useRef(null);
    const simulateMouseMove = useCallback((dx, dy) => {
        if (!iframeRef.current || isEditingRef.current) return;
        try {
            const doc = iframeRef.current.contentDocument;
            if (!doc) return;
            const canvas = doc.getElementById('unity-canvas');
            // Mantener el pointer lock desactivado (consistente con el disparo)
            if (canvas && !canvas.pointerLockDisabled) {
                canvas.requestPointerLock = () => {};
                canvas.pointerLockDisabled = true;
                doc.exitPointerLock?.();
            }
            const target = canvas || doc;
            const rect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
            const SENS = 1.4; // sensibilidad de la cámara táctil
            const mx = dx * SENS;
            const my = dy * SENS;
            // Acumular una posición absoluta dentro del canvas (por si el juego lee posición y no delta)
            if (!lookPosRef.current) {
                lookPosRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
            }
            lookPosRef.current.x = Math.max(rect.left, Math.min(rect.left + rect.width, lookPosRef.current.x + mx));
            lookPosRef.current.y = Math.max(rect.top,  Math.min(rect.top + rect.height, lookPosRef.current.y + my));
            target.dispatchEvent(new MouseEvent('mousemove', {
                bubbles: true, cancelable: true, button: 0, buttons: 0,
                clientX: lookPosRef.current.x, clientY: lookPosRef.current.y,
                movementX: mx, movementY: my,
            }));
        } catch (e) { console.error('simulateMouseMove', e); }
    }, []);

    const handleLookEnd = useCallback(() => { lookPosRef.current = null; }, []);

    const simulateMouseEvent = useCallback((eventType, buttonType = 0) => {
        if (!iframeRef.current || isEditingRef.current) return;
        try {
            const doc = iframeRef.current.contentDocument;
            if (!doc) return;
            const canvas = doc.getElementById('unity-canvas');
            if (canvas && !canvas.pointerLockDisabled) {
                canvas.requestPointerLock = () => {};
                canvas.pointerLockDisabled = true;
                doc.exitPointerLock?.();
            }
            const target = canvas || doc;
            const rect   = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
            const buttonValue = buttonType;
            const buttonsValue = eventType === 'mousedown' ? (buttonType === 2 ? 2 : 1) : 0;
            target.dispatchEvent(new MouseEvent(eventType, {
                bubbles: true, cancelable: true, button: buttonValue,
                buttons: buttonsValue,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top  + rect.height / 2,
            }));
        } catch (e) { console.error('simulateMouseEvent', e); }
    }, []);

    const updateDirection = useCallback((dir, press) => {
        if (activeDirections.current[dir] === press || isEditingRef.current) return;
        activeDirections.current[dir] = press;
        const MAP = {
            left:  ['ArrowLeft',  37, 'a', 65],
            right: ['ArrowRight', 39, 'd', 68],
            up:    ['ArrowUp',    38, 'w', 87],
            down:  ['ArrowDown',  40, 's', 83],
        };
        const [key, kc, alt, ac] = MAP[dir];
        simulateKeyEvent(key, kc, press);
        simulateKeyEvent(alt, ac, press);
    }, [simulateKeyEvent]);

    // Cambiar de arma: cicla 1 → 2 → 3 → 1 y presiona la tecla numérica correspondiente.
    const handleWeaponSwitch = useCallback(() => {
        if (isEditingRef.current) return;
        setCurrentWeapon(prev => {
            const next = (prev % 3) + 1;
            const key = String(next);
            const kc = 48 + next; // 49=Digit1, 50=Digit2, 51=Digit3
            simulateKeyEvent(key, kc, true);
            setTimeout(() => simulateKeyEvent(key, kc, false), 60);
            return next;
        });
    }, [simulateKeyEvent]);

    // ── Settings helpers ───────────────────────────────────────────────────────
    // Update a single property (scale/opacity) for the selected control
    const handlePropChange = useCallback((prop, value) => {
        setControlSettings(prev => {
            if (!prev[selectedControl]) return prev;
            return { ...prev, [selectedControl]: { ...prev[selectedControl], [prop]: value } };
        });
    }, [selectedControl]);

    // Accumulate drag offset for a control
    const handleDragEnd = useCallback((key, info) => {
        setControlSettings(prev => ({
            ...prev,
            [key]: { ...prev[key], x: prev[key].x + info.offset.x, y: prev[key].y + info.offset.y },
        }));
    }, []);

    const handleResetControls = useCallback(() => {
        setControlSettings(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)));
        setSelectedControl(null);
        setResetKey(k => k + 1);
    }, []);

    const handleCloseEdit = useCallback(() => setIsEditingControls(false), []);

    // Select a control (called from each control's onSelect)
    const selectControl = useCallback((key) => {
        setSelectedControl(prev => prev === key ? null : key); // toggle
    }, []);

    const selectJoystick  = useCallback(() => selectControl('joystick'), [selectControl]);
    const selectAgarrar   = useCallback(() => selectControl('agarrar'),  [selectControl]);
    const selectDisparar  = useCallback(() => selectControl('disparar'), [selectControl]);
    const selectSaltar    = useCallback(() => selectControl('saltar'),   [selectControl]);
    const selectSoltar    = useCallback(() => selectControl('soltar'),   [selectControl]);
    const selectArma      = useCallback(() => selectControl('arma'),     [selectControl]);

    // ── Fullscreen / Reload ────────────────────────────────────────────────────
    const handleFullscreen = useCallback(() => {
        if (isTouchDevice) {
            // Mobile: CSS 90° rotation — works cross-browser including iOS Safari.
            // No physical phone rotation required.
            setIsLandscapeMode(prev => {
                const next = !prev;
                if (next) {
                    // Bonus: also try to lock orientation on Android Chrome
                    screen.orientation?.lock?.('landscape').catch(() => {});
                } else {
                    screen.orientation?.unlock?.();
                }
                return next;
            });
            return;
        }

        // Desktop: native Fullscreen API
        const container = iframeContainerRef.current;
        if (!container) return;
        const requestFS =
            container.requestFullscreen ||
            container.webkitRequestFullscreen ||
            container.mozRequestFullScreen;
        if (requestFS) {
            requestFS.call(container)
                .then(() => screen.orientation?.lock?.('landscape-primary')?.catch?.(() => {}))
                .catch(err => console.log('Fullscreen error:', err));
        } else {
            iframeRef.current?.contentWindow?.postMessage('requestFullscreen', '*');
        }
    }, [isTouchDevice]);

    const handleReload = useCallback(() => {
        if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
    }, []);

    // ── Game message listener ──────────────────────────────────────────────────
    const handleGameMessage = useCallback(async (event) => {
        if (event.data?.source !== 'react-devtools-bridge' && event.data?.type !== 'webpackOk') {
            console.log('Mensaje recibido en GameHero:', event.data);
        }
        let data = event.data;
        if (typeof data === 'string') { try { data = JSON.parse(data); } catch (_) { /* */ } }
        if (!data || typeof data !== 'object') return;
        if (data.type !== 'GAME_OVER' && data.type !== 'setScore') return;
        if (!estaAutenticado) return;

        let puntos = 0, residuosRecolectados = 0, errores = 0, rachaMaxima = 0, tiempoJugado = 0;
        if (data.type === 'setScore') {
            puntos = data.score || 0;
            residuosRecolectados = puntos > 0 ? 1 : 0;
        } else {
            puntos = data.puntos || 0; residuosRecolectados = data.residuosRecolectados || 0;
            errores = data.errores || 0; rachaMaxima = data.rachaMaxima || 0; tiempoJugado = data.tiempoJugado || 0;
        }
        if (puntos <= 0 && residuosRecolectados <= 0) return;
        try {
            setGuardando(true);
            const response = await guardarPuntajeJuego({ puntos, residuosRecolectados, errores, rachaMaxima, tiempoJugado });
            if (response.success) {
                setResultadoPartida({
                    puntos: response.data.puntosGanados,
                    puntosTemporada: response.data.puntosTemporada,
                    nuevosLogros: response.data.nuevosLogros || [],
                });
                if (onPuntajeGuardado) onPuntajeGuardado();
            }
        } catch (err) { console.error('Error guardando puntaje:', err); }
        finally { setGuardando(false); }
    }, [estaAutenticado, onPuntajeGuardado]);

    useEffect(() => {
        window.addEventListener('message', handleGameMessage);
        return () => window.removeEventListener('message', handleGameMessage);
    }, [handleGameMessage]);

    useEffect(() => {
        const onChange = () => {
            const inFS = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement
            );
            setIsFullscreen(inFS);
            if (!inFS) {
                // Release orientation lock when exiting fullscreen
                try { screen.orientation?.unlock?.(); } catch (_) { /* ignore */ }
            }
        };
        document.addEventListener('fullscreenchange', onChange);
        document.addEventListener('webkitfullscreenchange', onChange);
        document.addEventListener('mozfullscreenchange', onChange);
        return () => {
            document.removeEventListener('fullscreenchange', onChange);
            document.removeEventListener('webkitfullscreenchange', onChange);
            document.removeEventListener('mozfullscreenchange', onChange);
        };
    }, []);

    // ── Shared draggable props builder ─────────────────────────────────────────
    const draggable = (key) => ({
        drag: isEditingControls,
        dragMomentum: false,
        dragElastic: 0,
        initial: { x: controlSettings[key].x, y: controlSettings[key].y },
        onDragEnd: (_, info) => handleDragEnd(key, info),
    });

    const cs = controlSettings; // shorthand

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 md:mb-16">
            <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-100 text-lime-700 text-sm font-medium mb-4"
            >
                <Gamepad2 className="w-4 h-4 text-lime-600" /> ¡Juego Disponible!
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-4 px-4">
                <span className="eco-gradient-text">Eco</span>-Juego
            </h1>
            <p className="text-lg md:text-xl text-green-700 max-w-2xl mx-auto mb-8 px-4">
                Aprende sobre reciclaje y medio ambiente de forma divertida mientras compites con amigos
            </p>

            <div className="max-w-5xl mx-auto md:px-6">
                <AnimatePresence mode="wait">

                    {/* ── Lobby ───────────────────────────────────────────── */}
                    {!isPlaying ? (
                        <motion.div
                            key="lobby"
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                            className="glass-card rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden max-w-3xl mx-auto border border-green-200/50 mx-4 md:mx-auto"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 via-emerald-400/10 to-green-500/20 pointer-events-none" />
                            <div className="relative z-10">
                                <motion.div
                                    animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-xl mb-6"
                                >
                                    <Gamepad2 className="w-12 h-12 md:w-16 md:h-16 text-white" />
                                </motion.div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-green-900 mb-4">Eco-Reciclador de Residuos</h2>
                                <p className="text-sm md:text-base text-green-700 mb-8 max-w-lg mx-auto">
                                    ¡Únete a la aventura! Aprende a clasificar los residuos correctamente y ayuda a salvar nuestro planeta en este juego interactivo en 3D.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-md mx-auto mb-8 bg-green-50/55 p-5 rounded-2xl border border-green-100">
                                    <div className="flex items-start gap-2">
                                        <Info className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-green-800"><strong>Instrucciones:</strong> Arrastra o selecciona el contenedor adecuado para cada tipo de residuo.</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <ShieldAlert className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-green-800"><strong>Consejo:</strong> Consigue rachas consecutivas para desbloquear multiplicadores de puntos.</p>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {resultadoPartida && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                            className="mb-6 bg-gradient-to-br from-lime-100 to-green-100 border-2 border-lime-300 rounded-2xl p-4 text-left"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    <p className="font-bold text-green-900 text-sm">¡Puntaje guardado!</p>
                                                </div>
                                                <button onClick={() => setResultadoPartida(null)} className="text-green-400 hover:text-green-700 text-xl leading-none">×</button>
                                            </div>
                                            <p className="text-2xl font-extrabold text-green-700">+{resultadoPartida.puntos.toLocaleString()} pts</p>
                                            <p className="text-xs text-green-600 mt-1">Total en temporada: {resultadoPartida.puntosTemporada.toLocaleString()} pts</p>
                                            {resultadoPartida.nuevosLogros.length > 0 && (
                                                <div className="mt-3 space-y-1">
                                                    <p className="text-xs font-semibold text-yellow-700 flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> ¡Logros desbloqueados!</p>
                                                    {resultadoPartida.nuevosLogros.map((l) => (
                                                        <div key={l.id} className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1">
                                                            <Star className="w-3 h-3 text-yellow-500" />
                                                            <span className="text-xs font-medium text-yellow-800">{l.nombre}</span>
                                                            <span className="ml-auto text-xs text-yellow-600 font-bold">+{l.puntos} pts</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.button
                                    {...animations.buttonHover}
                                    onClick={() => { setIsPlaying(true); setResultadoPartida(null); }}
                                    className="px-8 py-4 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white rounded-full font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 mx-auto text-lg cursor-pointer"
                                >
                                    <Play className="w-6 h-6 fill-white" /> ¡JUGAR AHORA!
                                </motion.button>
                            </div>
                        </motion.div>

                    ) : (
                    /* ── Gameplay ─────────────────────────────────────────── */
                        <motion.div
                            key="gameplay"
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                            className="w-full flex flex-col bg-slate-900 sm:rounded-3xl overflow-hidden shadow-2xl sm:border-4 border-emerald-500/30"
                            ref={gameWrapperRef}
                        >
                            {/* Toolbar */}
                            <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                                <button onClick={() => setIsPlaying(false)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-semibold cursor-pointer">
                                    <ArrowLeft className="w-4 h-4" /> Salir del juego
                                </button>
                                <div className="text-emerald-400 font-bold text-sm hidden sm:flex items-center gap-2">
                                    Eco-Juego Interactiva
                                    {guardando && <span className="text-xs text-lime-400 animate-pulse">💾 Guardando...</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsEditingControls(v => !v)}
                                        title="Personalizar Controles"
                                        className={`p-2 rounded-lg transition-colors cursor-pointer ${isTouchDevice ? '' : 'hidden'} ${isEditingControls ? 'text-emerald-400 bg-emerald-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                    <button onClick={handleReload} title="Reiniciar Juego" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"><RotateCcw className="w-4 h-4" /></button>
                                    <button
                                        onClick={handleFullscreen}
                                        title={isTouchDevice ? (isLandscapeMode ? 'Salir del modo horizontal' : 'Modo horizontal') : 'Pantalla Completa'}
                                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        {isTouchDevice && isLandscapeMode
                                            ? <Minimize2 className="w-4 h-4" />
                                            : <Maximize2 className="w-4 h-4" />
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Iframe + controles */}
                            <div
                                ref={iframeContainerRef}
                                className={`relative bg-black ${
                                    isLandscapeMode
                                        ? '' // fixed pos — aspect-ratio removed
                                        : isFullscreen
                                            ? 'w-full h-full'
                                            : 'w-full aspect-[4/3] sm:aspect-video'
                                }`}
                                style={isLandscapeMode ? {
                                    // CSS 90° clockwise rotation: fills the portrait screen as landscape.
                                    // Verified formula: width=100vh, height=100vw,
                                    // top=calc(50vh - 50vw), left=calc(50vw - 50vh), rotate(90deg).
                                    position: 'fixed',
                                    width: '100vh',
                                    height: '100vw',
                                    top: 'calc(50vh - 50vw)',
                                    left: 'calc(50vw - 50vh)',
                                    transform: 'rotate(90deg)',
                                    transformOrigin: '50% 50%',
                                    zIndex: 9999,
                                    backgroundColor: 'black',
                                } : undefined}
                            >
                                <iframe
                                    ref={iframeRef}
                                    src="/eco-juego/index.html"
                                    title="Eco Juego WebGL"
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                    allow="autoplay; fullscreen; xr-spatial-tracking; pointer-lock; orientation-lock"
                                />

                                {/* Panel de edición */}
                                <AnimatePresence>
                                    {isEditingControls && (
                                        <ControlEditPanel
                                            selectedKey={selectedControl}
                                            selectedCtrl={selectedControl ? cs[selectedControl] : null}
                                            onPropChange={handlePropChange}
                                            onReset={handleResetControls}
                                            onClose={handleCloseEdit}
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Exit landscape button — appears at visual top-left of landscape view */}
                                {isLandscapeMode && (
                                    <button
                                        onClick={() => setIsLandscapeMode(false)}
                                        title="Salir del modo horizontal"
                                        className="pointer-events-auto bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-slate-700 hover:bg-slate-700 transition-colors"
                                        style={{ position: 'absolute', right: 8, top: 8, width: 36, height: 36, zIndex: 20 }}
                                    >
                                        <Minimize2 className="w-4 h-4" />
                                    </button>
                                )}

                                {/* ── Controles móviles (touch devices) ── */}
                                <div className={`absolute inset-0 pointer-events-none z-10 ${isTouchDevice ? '' : 'hidden'}`}>

                                    {/* Panel de cámara (lado derecho): mirar/girar sin disparar.
                                        Va PRIMERO en el DOM para quedar por debajo de los botones. */}
                                    {!isEditingControls && (
                                        <CameraLookPad onLook={simulateMouseMove} onLookEnd={handleLookEnd} />
                                    )}

                                    {/* Joystick */}
                                    <motion.div
                                        key={`joystick-${resetKey}`}
                                        {...draggable('joystick')}
                                        style={{
                                            position: 'absolute', left: 16, bottom: safeBottom(16),
                                            scale: cs.joystick.scale,
                                            transformOrigin: 'bottom left',
                                            cursor: isEditingControls ? 'grab' : 'default',
                                            pointerEvents: 'auto',
                                        }}
                                    >
                                        <Joystick
                                            isEditing={isEditingControls}
                                            isSelected={selectedControl === 'joystick'}
                                            opacity={cs.joystick.opacity}
                                            onDirection={updateDirection}
                                            onSelect={selectJoystick}
                                        />
                                    </motion.div>

                                    {/* Botón Agarrar */}
                                    <motion.div
                                        key={`agarrar-${resetKey}`}
                                        {...draggable('agarrar')}
                                        style={{
                                            position: 'absolute', right: 82, bottom: safeBottom(80),
                                            scale: cs.agarrar.scale,
                                            transformOrigin: 'center',
                                            cursor: isEditingControls ? 'grab' : 'default',
                                            pointerEvents: 'auto',
                                        }}
                                    >
                                        <MobileActionButton
                                            label="Agarrar" keyName="e" keyCode={69}
                                            colorClass="bg-amber-500/80"
                                            isEditing={isEditingControls}
                                            isSelected={selectedControl === 'agarrar'}
                                            opacity={cs.agarrar.opacity}
                                            onKeyEvent={simulateKeyEvent}
                                            onMouseEvent={simulateMouseEvent}
                                            onSelect={selectAgarrar}
                                        />
                                    </motion.div>

                                    {/* Botón Disparar */}
                                    <motion.div
                                        key={`disparar-${resetKey}`}
                                        {...draggable('disparar')}
                                        style={{
                                            position: 'absolute', right: 16, bottom: safeBottom(80),
                                            scale: cs.disparar.scale,
                                            transformOrigin: 'center',
                                            cursor: isEditingControls ? 'grab' : 'default',
                                            pointerEvents: 'auto',
                                        }}
                                    >
                                        <MobileActionButton
                                            label="Disparar" isMouse={true}
                                            colorClass="bg-red-500/80"
                                            isEditing={isEditingControls}
                                            isSelected={selectedControl === 'disparar'}
                                            opacity={cs.disparar.opacity}
                                            onKeyEvent={simulateKeyEvent}
                                            onMouseEvent={simulateMouseEvent}
                                            onSelect={selectDisparar}
                                        />
                                    </motion.div>

                                    {/* Botón Soltar */}
                                    <motion.div
                                        key={`soltar-${resetKey}`}
                                        {...draggable('soltar')}
                                        style={{
                                            position: 'absolute', right: 148, bottom: safeBottom(80),
                                            scale: cs.soltar.scale,
                                            transformOrigin: 'center',
                                            cursor: isEditingControls ? 'grab' : 'default',
                                            pointerEvents: 'auto',
                                        }}
                                    >
                                        <MobileActionButton
                                            label="Soltar" isMouse={true} mouseButton={2}
                                            colorClass="bg-blue-500/80"
                                            isEditing={isEditingControls}
                                            isSelected={selectedControl === 'soltar'}
                                            opacity={cs.soltar.opacity}
                                            onKeyEvent={simulateKeyEvent}
                                            onMouseEvent={simulateMouseEvent}
                                            onSelect={selectSoltar}
                                        />
                                    </motion.div>

                                    {/* Botón Saltar */}
                                    <motion.div
                                        key={`saltar-${resetKey}`}
                                        {...draggable('saltar')}
                                        style={{
                                            position: 'absolute', right: 44, bottom: safeBottom(16),
                                            scale: cs.saltar.scale,
                                            transformOrigin: 'center',
                                            cursor: isEditingControls ? 'grab' : 'default',
                                            pointerEvents: 'auto',
                                        }}
                                    >
                                        <MobileActionButton
                                            label="Saltar" keyName=" " keyCode={32}
                                            colorClass="bg-emerald-600/85"
                                            size="w-16 h-16"
                                            isEditing={isEditingControls}
                                            isSelected={selectedControl === 'saltar'}
                                            opacity={cs.saltar.opacity}
                                            onKeyEvent={simulateKeyEvent}
                                            onMouseEvent={simulateMouseEvent}
                                            onSelect={selectSaltar}
                                        />
                                    </motion.div>

                                    {/* Botón Cambiar Arma (teclas 1/2/3) */}
                                    <motion.div
                                        key={`arma-${resetKey}`}
                                        {...draggable('arma')}
                                        style={{
                                            position: 'absolute', right: 16, bottom: safeBottom(152),
                                            scale: cs.arma.scale,
                                            transformOrigin: 'center',
                                            cursor: isEditingControls ? 'grab' : 'default',
                                            pointerEvents: 'auto',
                                        }}
                                    >
                                        <WeaponButton
                                            weapon={currentWeapon}
                                            isEditing={isEditingControls}
                                            isSelected={selectedControl === 'arma'}
                                            opacity={cs.arma.opacity}
                                            onPress={handleWeaponSwitch}
                                            onSelect={selectArma}
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default GameHero;