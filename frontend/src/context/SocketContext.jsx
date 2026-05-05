import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket debe usarse dentro de SocketProvider');
  return ctx;
};

export const SocketProvider = ({ children }) => {
  const { token, usuario } = useAuth();
  const [socket, setSocket] = useState(null);
  const [usuariosOnline, setUsuariosOnline] = useState(0);

  useEffect(() => {
    // No connect if there's no token (not authenticated)
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const backend = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

    // Create socket with token in auth (server should validate)
    const newSocket = io(backend, {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('usuario:conectado');
    });

    // Escuchar conteo de usuarios online
    newSocket.on('usuarios:online', (count) => {
      setUsuariosOnline(count);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket desconectado:', reason);
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [token]);

  const value = {
    socket,
    usuariosOnline,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;