import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const GoogleSuccess = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));

            const usuario = {
                _id: payload.id,
                rol: payload.rol,
                nombre: payload.nombre,
                apellido: payload.apellido,
                email: payload.email,
                edad: payload.edad,
                telefono: payload.telefono,
                googleId: payload.googleId,
                perfilCompleto: payload.perfilCompleto
            };

            login(token, usuario);

            // Pequeño delay para asegurar que el contexto se actualice antes de navegar
            setTimeout(() => {
                if (!payload.perfilCompleto) {
                    navigate('/completar-perfil');
                } else {
                    navigate('/');
                }
            }, 100);
        } else {
            navigate('/login');
        }
    }, []);

    return <div>Iniciando sesión con Google...</div>;
};

export default GoogleSuccess;