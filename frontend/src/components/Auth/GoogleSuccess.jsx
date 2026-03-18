import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const GoogleSuccess = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
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

            // Si el perfil está incompleto, forzar esa ruta sin importar el rol.
            // Si está completo, login() decide: admin → /admin, usuario → /
            const redirect = !payload.perfilCompleto ? '/completar-perfil' : null;
            login(token, usuario, redirect);

        } catch (error) {
            console.error('Error al procesar token de Google:', error);
            navigate('/login');
        }
    }, []);

    return <div>Iniciando sesión con Google...</div>;
};

export default GoogleSuccess;