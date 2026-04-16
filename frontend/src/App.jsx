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
import PoliticaDePrivacidad from "./components/legal/Politicadeprivacidad";
import TerminosYCondiciones from "./components/legal/Terminosycondiciones";

// ── Guards ───────────────────────────────────────────────────────────────────
import PrivateRoute  from "./context/PrivateRoute";
import PublicRoute   from "./context/PublicRoute";
import RecoveryRoute from "./Routes/RecoveryRoutes";
import AdminRestrictionGuard from "./context/AdminRestrictionGuard";

// ── Utilidades ───────────────────────────────────────────────────────────────
import ScrollToTop from "./components/animations/Scrolltotop";
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* ── Abiertas (cualquiera, con o sin sesión) ──────────────────────── */}
        <Route path="/"        element={<AdminRestrictionGuard><Home /></AdminRestrictionGuard>} />
        <Route path="/contact" element={<AdminRestrictionGuard><Contact /></AdminRestrictionGuard>} />
        <Route path="/maps"    element={<AdminRestrictionGuard><Mapapage /></AdminRestrictionGuard>} />
        <Route path="/politicadeprivacidad" element={<AdminRestrictionGuard><PoliticaDePrivacidad /></AdminRestrictionGuard>} />
        <Route path="/terminosycondiciones"    element={<AdminRestrictionGuard><TerminosYCondiciones /></AdminRestrictionGuard>} />

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
        <Route path="/ai"           element={<AdminRestrictionGuard><PrivateRoute><AIPage /></PrivateRoute></AdminRestrictionGuard>} />
        <Route path="/perfil"       element={<AdminRestrictionGuard><PrivateRoute><ProfileEcoIt /></PrivateRoute></AdminRestrictionGuard>} />
        <Route path="/editarperfil" element={<AdminRestrictionGuard><PrivateRoute><EditProfile /></PrivateRoute></AdminRestrictionGuard>} />
        <Route path="/game"         element={<AdminRestrictionGuard><PrivateRoute><GamePage /></PrivateRoute></AdminRestrictionGuard>} />

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