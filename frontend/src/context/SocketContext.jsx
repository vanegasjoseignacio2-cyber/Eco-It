import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './authContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket debe usarse dentro de SocketProvider');
  return ctx;
};

export const SocketProvider = ({ children }) => {
  const { token, usuario } = useAuth();
  const socketRef = useRef(null);
  const [usuariosOnline, setUsuariosOnline] = useState(0);

  useEffect(() => {
    // No connect if there's no token (not authenticated)
    if (!token) return;

    const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    // Create socket with token in auth (server should validate)
    const socket = io(backend, {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('usuario:conectado', usuario);
    });

    // Escuchar conteo de usuarios online
    socket.on('usuarios:online', (count) => {
      setUsuariosOnline(count);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket desconectado:', reason);
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  const value = {
    socket: socketRef.current,
    usuariosOnline,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;