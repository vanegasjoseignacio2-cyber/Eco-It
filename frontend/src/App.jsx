import { Routes, Route } from "react-router-dom";

import Home from "./components/pages/Home";
import Register from "./components/pages/Registerpage";
import Contact from "./components/pages/Contactpage";
import Mapapage from "./components/pages/Mapapage";
import AIPage from "./components/pages/AIPage";
import Login from "./components/pages/Loginpage";
import GoogleSuccess from "./components/Auth/GoogleSuccess";
import CompletarPerfil from "./components/Auth/CompletarPerfil";
import RecuperarPage from "./components/pages/RecuperarPage";
import RecoveryRoute from "./Routes/RecoveryRoutes";
import ProfileEcoIt from "./components/Perfil/Perfil";
import EditProfile from "./components/Perfil/EditarPefil";
import GamePage from "./components/pages/GamePage";
import AdminLayout from "./components/pages/AdminLayout";
import PrivateRoute from "./context/PrivateRoute";
import { AuthProvider } from "./context/authContext";
import ScrollToTop from "./components/animations/Scrolltotop";
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/maps" element={<Mapapage />} />
      <Route path="/ai" element={<AIPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/google/success" element={<GoogleSuccess />} />
      <Route path="/completar-perfil" element={<CompletarPerfil />} />
      <Route path="/recuperar" element={<RecuperarPage />} />
      <Route
        path="/verificar-codigo"
        element={
          <RecoveryRoute>
            <RecuperarPage />
          </RecoveryRoute>
        }
      />
      <Route path='/perfil' element={
            <PrivateRoute>
              <ProfileEcoIt />
            </PrivateRoute>
          } />

      <Route path="/editarperfil" element={<EditProfile />} />
      <Route path="/game" element={<GamePage />} />
      <Route path='/admin' element={
      <PrivateRoute rolRequerido="admin">
              <AdminLayout />
            </PrivateRoute>} />
    </Routes>
  </AuthProvider>
  );
}

export default App;