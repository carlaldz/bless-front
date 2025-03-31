import axios from "axios";
const API_BASE_URL = "http://localhost:5000"; 
// Configuración base de axios
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de respuestas
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Manejo mejorado de errores
    let errorMessage = "Error de conexión";
    let status = error.response?.status;
    
    if (error.response) {
      errorMessage = error.response.data?.message || 
                    error.response.data?.error || 
                    error.message;
      
      // Manejo específico para errores 401 (No autorizado)
      if (status === 401) {
        // Puedes redirigir al login aquí si lo prefieres
        console.warn("No autorizado - redirigiendo al login");
      }
    } else if (error.request) {
      errorMessage = "No se recibió respuesta del servidor";
    }

    const errorDetails = {
      status,
      data: error.response?.data,
      message: errorMessage,
      originalError: error,
    };
    
    console.error("Error en la petición:", errorDetails);
    return Promise.reject(errorDetails);
  }
);

// Funciones de autenticación
const register = (userData) => http.post("/users", userData);

const login = (credentials) => http.post("/login", credentials); // Cambiado de "/sessions" a "/login"

const logout = () => http.post("/logout");

const getCurrentUser = () => http.get("/users/me");

// Funciones de eventos
const listEvents = ({ page, date, limit = 10 }) => {
  const params = {
    limit: Number(limit) > 0 ? Number(limit) : 10,
    page: Number(page) > 0 ? Number(page) : 1,
    date: date && !isNaN(Date.parse(date)) ? new Date(date).toISOString() : undefined,
  };

  return http.get("/events", { params }); // Cambiado de "/eventos" a "/events"
};

const getEvent = (id) => {
  if (!id) throw new Error("Se requiere ID del evento");
  return http.get(`/events/${id}`);
};

const createEvent = (eventData) => http.post("/events", eventData);

const updateEvent = (id, eventData) => {
  if (!id) throw new Error("Se requiere ID del evento");
  return http.patch(`/events/${id}`, eventData);
};

const deleteEvent = (id) => {
  if (!id) throw new Error("Se requiere ID del evento");
  return http.delete(`/events/${id}`);
};

// Objeto API
const BlessApi = {
  // Autenticación
  login,
  logout,
  register,
  getCurrentUser,
  
  // Eventos
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};

export default BlessApi;