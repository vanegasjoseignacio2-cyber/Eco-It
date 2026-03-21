import { Routes, Route } from "react-router-dom";

// ── Páginas ──────────────────────────────────────────────────────────────────
import Home            from "./components/pages/Home";
import Register        from "./components/pages/Registerpage";
import Contact         from "./components/pages/Contactpage";
import Mapapage        from "./components/pages/Mapapage";
import AIPage          from "./components/pages/AIPage";
import Login           from "./components/pages/Loginpage";
import GoogleSuccess   from "./components/Auth/GoogleSuccess";
import CompletarPerfil from "./components/Auth/CompletarPerfil";
import RecuperarPage   from "./components/pages/RecuperarPage";
import ProfileEcoIt    from "./components/Perfil/Perfil";
import EditProfile     from "./components/Perfil/EditarPefil";
import GamePage        from "./components/pages/GamePage";
import AdminLayout     from "./components/pages/AdminLayout";

// ── Guards ───────────────────────────────────────────────────────────────────
import PrivateRoute  from "./context/PrivateRoute";
import PublicRoute   from "./context/PublicRoute";
import RecoveryRoute from "./Routes/RecoveryRoutes";

// ── Utilidades ───────────────────────────────────────────────────────────────
import ScrollToTop from "./components/animations/Scrolltotop";
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* ── Abiertas (cualquiera, con o sin sesión) ──────────────────────── */}
        <Route path="/"        element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/maps"    element={<Mapapage />} />

        {/* ── Solo sin sesión activa ───────────────────────────────────────── */}
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* ── Recuperación de contraseña ───────────────────────────────────── */}
        <Route path="/recuperar"        element={<RecuperarPage />} />
        <Route path="/verificar-codigo" element={<RecoveryRoute><RecuperarPage /></RecoveryRoute>} />

        {/* ── OAuth Google ─────────────────────────────────────────────────── */}
        <Route path="/auth/google/success" element={<GoogleSuccess />} />

        {/* ── Completar perfil ─────────────────────────────────────────────── */}
        <Route path="/completar-perfil" element={
          <PrivateRoute>
            <CompletarPerfil />
          </PrivateRoute>
        } />

        {/* ── Privadas (requieren sesión + perfil completo) ────────────────── */}
        <Route path="/ai"           element={<PrivateRoute><AIPage /></PrivateRoute>} />
        <Route path="/perfil"       element={<PrivateRoute><ProfileEcoIt /></PrivateRoute>} />
        <Route path="/editarperfil" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/game"         element={<PrivateRoute><GamePage /></PrivateRoute>} />

        {/* ── Privadas con rol admin ───────────────────────────────────────── */}
        <Route path="/admin" element={
          <PrivateRoute rolRequerido="admin">
            <AdminLayout />
          </PrivateRoute>
        } />

      </Routes>
    </>
  );
}

export default App;