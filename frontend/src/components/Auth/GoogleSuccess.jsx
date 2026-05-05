import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerPerfil } from '../../services/api';

const GoogleSuccess = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const fetchUserAndLogin = async () => {
            try {
                // Extraer el token de la URL si viene desde Google OAuth
                const params = new URLSearchParams(window.location.search);
                const tokenUrl = params.get('token');
                
                if (tokenUrl) {
                    // Guardamos el token en localStorage para que fetchAPI lo use
                    localStorage.setItem('token', tokenUrl);
                }

                // Ahora fetchAPI enviará el token en el header Authorization
                const data = await obtenerPerfil();
                if (!data.success) throw new Error(data.mensaje);

                const usuario = data.data; 

                // Si el perfil está incompleto, forzar esa ruta
                const redirect = !usuario.perfilCompleto ? '/completar-perfil' : null;
                // Pasar el token extraído o el que ya esté en localStorage
                const tokenToUse = tokenUrl || localStorage.getItem('token');
                login(tokenToUse, usuario, redirect);

            } catch (error) {
                console.error('Error al procesar login de Google:', error);
                navigate('/login');
            }
        };

        fetchUserAndLogin();
    }, [navigate, login]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-green-800 font-medium animate-pulse">Iniciando sesión con Google...</p>
            </div>
        </div>
    );
};

export default GoogleSuccess;