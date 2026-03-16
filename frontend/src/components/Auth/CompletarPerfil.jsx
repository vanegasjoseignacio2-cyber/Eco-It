import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const CompletarPerfil = () => {
    const { token, usuario, login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ apellido: '', edad: '', telefono: '' });
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            const res = await fetch('http://localhost:3000/api/auth/completar-perfil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    apellido: form.apellido,
                    edad: Number(form.edad),
                    telefono: form.telefono
                })
            });
            const data = await res.json();
            if (data.success) {
                login(token, data.usuario);
                navigate('/');
            } else {
                setError(data.mensaje || 'Error al guardar los datos.');
            }
        } catch (err) {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.bgDecor} />
            <div style={styles.card}>
                <div style={styles.iconWrapper}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M17 8C15.5 5.5 12 4 12 4S8.5 5.5 7 8c-1 1.5-1 4 0 6 1.5 2.5 5 4 5 4s3.5-1.5 5-4c1-2 1-4.5 0-6z" fill="white" opacity="0.9" />
                    </svg>
                </div>

                <h1 style={styles.title}>Completa tu perfil</h1>
                <p style={styles.subtitle}>Solo faltan unos datos para terminar tu registro con Google</p>

                <div style={styles.googleInfo}>
                    <div style={styles.googleAvatar}>{usuario?.nombre?.charAt(0).toUpperCase()}</div>
                    <div>
                        <p style={styles.googleName}>{usuario?.nombre}</p>
                        <p style={styles.googleEmail}>{usuario?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Apellido */}
                    <div style={styles.field}>
                        <label style={styles.label}>Apellido</label>
                        <div style={styles.inputWrapper}>
                            <span style={styles.inputIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <input type="text" name="apellido" placeholder="Tu apellido"
                                value={form.apellido} onChange={handleChange} required style={styles.input}
                                onFocus={e => e.target.parentElement.style.borderColor = '#10B981'}
                                onBlur={e => e.target.parentElement.style.borderColor = '#e5e7eb'} />
                        </div>
                    </div>

                    {/* Edad */}
                    <div style={styles.field}>
                        <label style={styles.label}>Edad</label>
                        <div style={styles.inputWrapper}>
                            <span style={styles.inputIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </span>
                            <input type="number" name="edad" placeholder="Tu edad"
                                value={form.edad} onChange={handleChange} required min="5" max="120" style={styles.input}
                                onFocus={e => e.target.parentElement.style.borderColor = '#10B981'}
                                onBlur={e => e.target.parentElement.style.borderColor = '#e5e7eb'} />
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div style={styles.field}>
                        <label style={styles.label}>Teléfono</label>
                        <div style={styles.inputWrapper}>
                            <span style={styles.inputIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.99-2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </span>
                            <input type="tel" name="telefono" placeholder="+57 300 123 4567"
                                value={form.telefono} onChange={handleChange} required style={styles.input}
                                onFocus={e => e.target.parentElement.style.borderColor = '#10B981'}
                                onBlur={e => e.target.parentElement.style.borderColor = '#e5e7eb'} />
                        </div>
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <button type="submit" disabled={cargando}
                        style={cargando ? { ...styles.btn, opacity: 0.7 } : styles.btn}>
                        {cargando ? 'Guardando...' : '✅ Guardar y continuar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', position: 'relative', overflow: 'hidden',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    bgDecor: {
        position: 'absolute', top: '-100px', right: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
    },
    card: {
        background: '#ffffff', borderRadius: '24px', padding: '48px 40px',
        width: '100%', maxWidth: '460px',
        boxShadow: '0 20px 60px rgba(16,185,129,0.12), 0 4px 16px rgba(0,0,0,0.06)',
        position: 'relative', zIndex: 1
    },
    iconWrapper: {
        width: '64px', height: '64px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(16,185,129,0.3)'
    },
    title: { fontSize: '26px', fontWeight: '700', color: '#111827', textAlign: 'center', margin: '0 0 8px' },
    subtitle: { fontSize: '14px', color: '#6b7280', textAlign: 'center', margin: '0 0 24px', lineHeight: '1.5' },
    googleInfo: {
        display: 'flex', alignItems: 'center', gap: '12px',
        background: '#f0fdf4', border: '1px solid #bbf7d0',
        borderRadius: '12px', padding: '12px 16px', marginBottom: '28px'
    },
    googleAvatar: {
        width: '40px', height: '40px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #10B981, #059669)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0
    },
    googleName: { margin: 0, fontWeight: '600', color: '#111827', fontSize: '14px' },
    googleEmail: { margin: 0, color: '#6b7280', fontSize: '12px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#374151' },
    inputWrapper: {
        display: 'flex', alignItems: 'center',
        border: '1.5px solid #e5e7eb', borderRadius: '12px',
        background: '#f9fafb', padding: '0 14px',
        transition: 'border-color 0.2s', gap: '10px'
    },
    inputIcon: { display: 'flex', alignItems: 'center', flexShrink: 0 },
    input: {
        flex: 1, border: 'none', background: 'transparent',
        padding: '13px 0', fontSize: '15px', color: '#111827',
        outline: 'none', width: '100%'
    },
    error: {
        background: '#fef2f2', border: '1px solid #fecaca',
        color: '#dc2626', borderRadius: '10px',
        padding: '10px 14px', fontSize: '13px', margin: 0
    },
    btn: {
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        color: 'white', border: 'none', borderRadius: '12px',
        padding: '15px', fontSize: '16px', fontWeight: '700',
        cursor: 'pointer', marginTop: '4px',
        boxShadow: '0 4px 16px rgba(16,185,129,0.35)'
    }
};

export default CompletarPerfil;