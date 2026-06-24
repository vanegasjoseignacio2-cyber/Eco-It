import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider }          from './context/AuthContext.jsx';
import { SocketProvider }        from './context/SocketContext.jsx';
import { ToastProvider }         from './context/ToastContext.jsx';
import { ConsentProvider } from './context/ConsentContext.jsx';
import ConsentBanner             from './components/ui/ConsentBanner.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <SocketProvider>
            {/*
              ConsentProvider gestiona cuándo mostrar el banner.
              ConsentBanner se renderiza aquí para estar en todas las páginas,
              pero el banner solo aparece cuando Home.jsx llama a checkAndShow()
              (es decir, después de que termina la animación de carga).
            */}
            <ConsentProvider>
              <App />
              <ConsentBanner />
            </ConsentProvider>
          </SocketProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);