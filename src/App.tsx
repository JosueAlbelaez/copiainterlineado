import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { UserCircle2, LogIn } from "lucide-react";
import { SignInForm } from "./components/auth/SignInForm";
import { SignUpForm } from "./components/auth/SignUpForm";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { ReadingPage } from "./pages/ReadingPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

function App() {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState<"signin" | "signup" | "reset" | null>(null);

  const handleAuthSuccess = () => {
    setShowAuthModal(null);
  };

  // Ruta especial para reseteo de contraseña
  if (window.location.pathname.startsWith('/reset-password')) {
    return <ResetPasswordPage />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-screen py-12">
            <div className="text-center space-y-8 max-w-md">
              <UserCircle2 className="w-20 h-20 mx-auto text-green-600" />
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Bienvenido a Fluent Phrases
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Mejora tu inglés con frases prácticas y contextualizadas
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowAuthModal("signin")}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-lg font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Iniciar sesión
                </button>
                <button
                  onClick={() => setShowAuthModal("signup")}
                  className="inline-flex items-center px-6 py-3 border-2 border-green-600 text-green-600 text-lg font-medium rounded-lg hover:bg-green-50 transition-colors dark:hover:bg-green-900"
                >
                  Registrarse gratis
                </button>
              </div>
              <div>
                <button
                  onClick={() => setShowAuthModal("reset")}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  ¿Olvidaste tu contraseña? Recuperar contraseña
                </button>
              </div>
            </div>
          </div>
        </div>

        {showAuthModal === "signin" && (
          <SignInForm 
            onAuthSuccess={handleAuthSuccess}
            onSwitchToSignUp={() => setShowAuthModal("signup")}
          />
        )}
        {showAuthModal === "signup" && (
          <SignUpForm 
            onAuthSuccess={handleAuthSuccess}
            onSwitchToSignIn={() => setShowAuthModal("signin")}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reading/:id" element={<ReadingPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;