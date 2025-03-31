import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BlessApi from "../services/api-service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await BlessApi.profile();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Efecto para control de acceso
  useEffect(() => {
    if (!loading) {
      // Protección específica para /addevent
      if (location.pathname === '/addevent') {
        if (!user) {
          // Usuario no logueado -> redirige a login
          navigate('/login', { state: { from: location } });
        } else if (user.role !== 'admin') {
          // Usuario no admin -> redirige a no autorizado
          navigate('/unauthorized');
        }
      }
    }
  }, [user, loading, location, navigate]);

  const login = async (credentials) => {
    try {
      const userData = await BlessApi.login(credentials);
      setUser(userData);
      // Redirige a la ruta original solicitada o a home
      navigate(location.state?.from?.pathname || '/');
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await BlessApi.logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  if (loading) {
    return <div className="loading-auth">Verificando sesión...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}