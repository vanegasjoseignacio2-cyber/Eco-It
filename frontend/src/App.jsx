import { Routes, Route } from "react-router-dom";

import Home from "./components/pages/Home";
import Register from "./components/pages/Registerpage";
import Contact from "./components/pages/Contactpage";
import Mapapage from "./components/pages/Mapapage";
import AIPage from "./components/pages/AIPage";
import Login from "./components/pages/Loginpage";
import RecuperarPage from "./components/pages/RecuperarPage";
import VerificarCodePage from "./components/pages/VerificarCodePage";
import ProfileEcoIt from "./components/Perfil/Perfil";
import EditProfile from "./components/Perfil/EditarPefil";
import GamePage from "./components/pages/GamePage";
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/maps" element={<Mapapage />} />
      <Route path="/ai" element={<AIPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar" element={<RecuperarPage />} />
      <Route path="/verificar-codigo" element={<VerificarCodePage />} />
      <Route path="/profile" element={<ProfileEcoIt />} />
      <Route path="/editarperfil" element={<EditProfile />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
}

export default App;
