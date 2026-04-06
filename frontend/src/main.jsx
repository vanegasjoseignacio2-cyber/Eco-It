import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider }          from './context/AuthContext.jsx';
import { SocketProvider }        from './context/SocketContext.jsx';
import { ToastProvider }         from './context/ToastContext.jsx';
import { CookieConsentProvider } from './context/Cookieconsentcontext.jsx';
import CookieConsent             from './components/ui/CookieConsent.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ToastProvider>
            {/*
              CookieConsentProvider gestiona cuándo mostrar el banner.
              CookieConsent se renderiza aquí para estar en todas las páginas,
              pero el banner solo aparece cuando Home.jsx llama a checkAndShow()
              (es decir, después de que termina la animación de carga).
            */}
            <CookieConsentProvider>
              <App />
              <CookieConsent />
            </CookieConsentProvider>
          </ToastProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);