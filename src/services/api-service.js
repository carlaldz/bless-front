import axios from "axios";

const LOCAL_API_URL = "http://localhost:5000/api/v1";
const PRODUCTION_API_URL = import.meta.env.VITE_API_URL || "https://tu-backend-deploy.com/api/v1";

const http = axios.create({
  baseURL: import.meta.env.PROD ? PRODUCTION_API_URL : LOCAL_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    let errorMessage = "Error de conexión";
    let errorData = {};

    if (error.response) {
      errorData = error.response.data;
      errorMessage = errorData?.message || 
                    errorData?.error?.message || 
                    error.message;

      if (status === 401) {
        console.warn("No autorizado - redirigiendo al login");
      }
    } else if (error.request) {
      errorMessage = "El servidor no respondió";
      errorData = { code: "ECONNABORTED" };
    }

    const errorDetails = {
      status,
      data: errorData,
      message: errorMessage,
      originalError: error,
    };
    
    console.error("[API Error]", errorDetails);
    return Promise.reject(errorDetails);
  }
);


const register = (userData) => http.post("/users", userData);
const login = (credentials) => http.post("/sessions", credentials); 
const logout = () => http.delete("/sessions"); 
const getCurrentUser = () => http.get("/users/me");


const listEvents = () => http.get("/events");


const getEvent = (id) => {
  if (!id) throw new Error("Se requiere ID del evento");
  return http.get(`/events/${id}`);
};

const createEvent = (eventData) => http.post("/events", eventData);
const updateEvent = (id, eventData) => http.patch(`/events/${id}`, eventData);
const deleteEvent = (id) => http.delete(`/events/${id}`);


const BlessApi = {
  login,
  logout,
  register,
  getCurrentUser,
  
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};

export default BlessApi;