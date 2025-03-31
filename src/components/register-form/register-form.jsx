import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import BlessApi from "../../services/api-service";
import "./register-form.css";

function RegisterForm() {
  const { register, handleSubmit, formState, setError, clearErrors } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { errors, isSubmitting } = formState;
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (userData) => {
    try {
      setApiError(""); 
      clearErrors();
      
      const response = await BlessApi.register({
        name: userData.nombre,
        lastName: userData.apellidos,
        email: userData.email,
        password: userData.password
      });

      if (response) {
        setSuccessMessage("¡Registro exitoso! Redirigiendo...");
        
        try {
          const loginResponse = await BlessApi.login({
            email: userData.email,
            password: userData.password
          });
          
          if (loginResponse.user) {
            login(loginResponse.user);
            navigate("/");
          }
        } catch (loginError) {
          console.error("Error en auto-login:", loginError);
          navigate("/login", { state: { registered: true } });
        }
      }
    } catch (error) {
      console.error("Error en registro:", error);
      
      if (error.data?.errors) {
        const serverErrors = error.data.errors;
        
        const fieldMapping = {
          name: "nombre",
          lastName: "apellidos",
          email: "email",
          password: "password"
        };
        
        Object.keys(serverErrors).forEach((field) => {
          const frontendField = fieldMapping[field] || field;
          setError(frontendField, { 
            type: "server", 
            message: serverErrors[field] 
          });
        });
      } else if (error.message) {
        setApiError(error.message);
      } else {
        setApiError("Error desconocido durante el registro");
      }
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit(handleRegister)} className="register-form">
        <h2 className="register-title">Regístrate:</h2>
        
        {apiError && <div className="register-error">{apiError}</div>}
        {successMessage && <div className="register-success">{successMessage}</div>}

        <div className="register-field">
          <label htmlFor="nombre" className="register-label"></label>
          <input
            id="nombre"
            type="text"
            className={`register-input ${errors.nombre ? "register-input-error" : ""}`}
            placeholder="Introduce tu nombre"
            {...register("nombre", { 
              required: "Campo obligatorio",
              minLength: {
                value: 2,
                message: "Mínimo 2 caracteres"
              }
            })}
          />
          {errors.nombre && (
            <div className="register-error-message">{errors.nombre.message}</div>
          )}
        </div>

        <div className="register-field">
          <label htmlFor="apellidos" className="register-label"></label>
          <input
            id="apellidos"
            type="text"
            className={`register-input ${errors.apellidos ? "register-input-error" : ""}`}
            placeholder="Introduce tus apellidos"
            {...register("apellidos", { 
              required: "Campo obligatorio",
              minLength: {
                value: 2,
                message: "Mínimo 2 caracteres"
              }
            })}
          />
          {errors.apellidos && (
            <div className="register-error-message">{errors.apellidos.message}</div>
          )}
        </div>

        <div className="register-field">
          <label htmlFor="email" className="register-label"></label>
          <input
            id="email"
            type="email"
            className={`register-input ${errors.email ? "register-input-error" : ""}`}
            placeholder="Introduce tu email"
            {...register("email", { 
              required: "Campo obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email no válido"
              }
            })}
          />
          {errors.email && (
            <div className="register-error-message">{errors.email.message}</div>
          )}
        </div>

        <div className="register-field">
          <label htmlFor="password" className="register-label"></label>
          <input
            id="password"
            type="password"
            className={`register-input ${errors.password ? "register-input-error" : ""}`}
            placeholder="******"
            {...register("password", { 
              required: "Campo obligatorio",
              minLength: {
                value: 6,
                message: "Mínimo 6 caracteres"
              }
            })}
          />
          {errors.password && (
            <div className="register-error-message">{errors.password.message}</div>
          )}
        </div>

        <button 
          type="submit" 
          className="register-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;