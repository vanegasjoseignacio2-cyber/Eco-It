import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, Facebook, AlertCircle, LogIn, CheckCircle } from "lucide-react";
import { iniciarSesion } from "../../services/api";
import { useAuth } from "../../context/authContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ← Usar el contexto
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isValidEmail = /^\S+@\S+\.\S+$/.test(email);
  const canSubmit = isValidEmail && password.length >= 8;

  const emailEmpty = email.trim() === "";
  const showEmailError = (emailEmpty || !isValidEmail) && (touched.email || hasTriedSubmit) && !error;
  const emailMessage = emailEmpty
    ? "Ingresa tu correo electrónico."
    : !isValidEmail
    ? "Usa un formato válido (ej. nombre@dominio.com)."
    : "";

  const passwordEmpty = password.trim() === "";
  const showPasswordError = (passwordEmpty || password.length < 8) && (touched.password || hasTriedSubmit) && !error;
  const passwordMessage = passwordEmpty
    ? "Ingresa tu contraseña."
    : password.length < 8
    ? "La contraseña debe tener al menos 8 caracteres."
    : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasTriedSubmit(true);
    
    setError("");
    setSuccessMessage("");

    if (!canSubmit || isLoading) return;

    setIsLoading(true);

    try {
      const response = await iniciarSesion({
        email: email.trim().toLowerCase(),
        password: password
      });

      console.log('Login exitoso:', response);

      // Usar la función login del contexto
      login(response.data.token, response.data.usuario);

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      setSuccessMessage("¡Bienvenido de vuelta! 🌱");

      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (err) {
      console.error('Error en login:', err);
      
      if (err.message.includes('Credenciales inválidas')) {
        setError("Email o contraseña incorrectos. Verifica tus datos.");
      } else if (err.message.includes('email')) {
        setError("No existe una cuenta con este email.");
      } else {
        setError(err.message || "Error al iniciar sesión. Verifica tu conexión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full items-center justify-center flex
          mx-auto w-16 h-16 text-white shadow-md shadow-gray-400 mb-2">
            <LogIn className="w-8 h-8 stroke-[2.5]"/>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-2">
            Bienvenido
          </h2>
          <p className="text-green-600 font-semibold">
            Inicia sesión en tu cuenta Eco-It
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-start gap-3 shadow-lg border-2 border-green-400">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{successMessage}</p>
              <p className="text-white/90 text-sm mt-1">Redirigiendo...</p>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                placeholder="tu@email.com"
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border-2 ${
                  showEmailError 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-green-200 focus:border-green-500 focus:ring-green-500/20'
                } outline-none transition-all text-green-900 placeholder-green-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                required
                aria-invalid={showEmailError}
                aria-describedby="email-error"
              />
            </div>
            {showEmailError && (
              <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {emailMessage}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                placeholder="••••••••"
                disabled={isLoading}
                className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-white border-2 ${
                  showPasswordError 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-green-200 focus:border-green-500 focus:ring-green-500/20'
                } outline-none transition-all text-green-900 placeholder-green-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                required
                minLength={8}
                aria-invalid={showPasswordError}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-700 transition-colors disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {showPasswordError && (
              <p id="password-error" className="mt-2 text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {passwordMessage}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-green-300 text-green-600 focus:ring-green-500 disabled:opacity-50"
              />
              <span className="text-sm text-green-700">Recordarme</span>
            </label>
            <a href="/recuperar" className="text-sm text-green-600 hover:text-green-800 font-medium">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading || !canSubmit}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              <>
                Iniciar Sesión
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-green-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 text-green-600">O continúa con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button 
              type="button"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome className="w-5 h-5" />
              Google
            </button>
            <button 
              type="button"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Facebook className="w-5 h-5" />
              Facebook
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-green-600">
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="font-semibold text-green-700 hover:text-green-800">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}