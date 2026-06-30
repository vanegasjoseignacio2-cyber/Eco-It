import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

// ── Páginas (lazy — cada ruta carga su chunk solo cuando se visita) ───────────
import Home            from "./components/pages/Home";
const Register        = lazy(() => import("./components/pages/Registerpage"));
const Contact         = lazy(() => import("./components/pages/Contactpage"));
const Mapapage        = lazy(() => import("./components/pages/Mapapage"));
const AIPage          = lazy(() => import("./components/pages/AIPage"));
const Login           = lazy(() => import("./components/pages/Loginpage"));
const GoogleSuccess   = lazy(() => import("./components/Auth/GoogleSuccess"));
const CompletarPerfil = lazy(() => import("./components/Auth/CompletarPerfil"));
const RecuperarPage   = lazy(() => import("./components/pages/RecuperarPage"));
const ProfileEcoIt    = lazy(() => import("./components/Perfil/Perfil"));
const EditProfile     = lazy(() => import("./components/Perfil/EditarPefil"));
const GamePage        = lazy(() => import("./components/pages/GamePage"));
const AdminLayout     = lazy(() => import("./components/pages/AdminLayout"));
const PoliticaDePrivacidad = lazy(() => import("./components/legal/Politicadeprivacidad"));
const TerminosYCondiciones = lazy(() => import("./components/legal/Terminosycondiciones"));

// ── Guards ───────────────────────────────────────────────────────────────────
import PrivateRoute  from "./context/PrivateRoute";
import PublicRoute   from "./context/PublicRoute";
import RecoveryRoute from "./Routes/RecoveryRoutes";
import AdminRestrictionGuard from "./context/AdminRestrictionGuard";

// ── Utilidades ───────────────────────────────────────────────────────────────
import ScrollToTop from "./components/animations/Scrolltotop";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";

function PageLoader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ width: 40, height: 40, border: "4px solid #e0e0e0", borderTop: "4px solid #2e7d32", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <ScrollToTopButton />

      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* ── Abiertas ─────────────────────────────────────────────────── */}
          <Route path="/"        element={<AdminRestrictionGuard><Home /></AdminRestrictionGuard>} />
          <Route path="/contact" element={<AdminRestrictionGuard><Contact /></AdminRestrictionGuard>} />
          <Route path="/maps"    element={<AdminRestrictionGuard><Mapapage /></AdminRestrictionGuard>} />
          <Route path="/politicadeprivacidad" element={<AdminRestrictionGuard><PoliticaDePrivacidad /></AdminRestrictionGuard>} />
          <Route path="/terminosycondiciones" element={<AdminRestrictionGuard><TerminosYCondiciones /></AdminRestrictionGuard>} />

          {/* ── Solo sin sesión activa ───────────────────────────────────── */}
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* ── Recuperación de contraseña ───────────────────────────────── */}
          <Route path="/recuperar"        element={<RecuperarPage />} />
          <Route path="/verificar-codigo" element={<RecoveryRoute><RecuperarPage /></RecoveryRoute>} />

          {/* ── OAuth Google ─────────────────────────────────────────────── */}
          <Route path="/auth/google/success" element={<GoogleSuccess />} />

          {/* ── Completar perfil ─────────────────────────────────────────── */}
          <Route path="/completar-perfil" element={
            <PrivateRoute>
              <CompletarPerfil />
            </PrivateRoute>
          } />

          {/* ── Privadas ─────────────────────────────────────────────────── */}
          <Route path="/ai"           element={<AdminRestrictionGuard><PrivateRoute><AIPage /></PrivateRoute></AdminRestrictionGuard>} />
          <Route path="/perfil"       element={<AdminRestrictionGuard><PrivateRoute><ProfileEcoIt /></PrivateRoute></AdminRestrictionGuard>} />
          <Route path="/editarperfil" element={<AdminRestrictionGuard><PrivateRoute><EditProfile /></PrivateRoute></AdminRestrictionGuard>} />
          <Route path="/game"         element={<AdminRestrictionGuard><PrivateRoute><GamePage /></PrivateRoute></AdminRestrictionGuard>} />

          {/* ── Admin ────────────────────────────────────────────────────── */}
          <Route path="/admin" element={
            <PrivateRoute rolRequerido="admin">
              <AdminLayout />
            </PrivateRoute>
          } />

        </Routes>
      </Suspense>
    </>
  );
}

export default App;
