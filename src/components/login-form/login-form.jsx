import "./login-form.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../../contexts/auth-context";
import BlessApi from "../../services/api-service"; 

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate (); 
  const { login } = useAuth(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const user = await BlessApi.login({ email, password });
      console.log("Usuario logueado:", user);
      login(user);
      setError("");
      navigate("/");
    } catch (error) {
      console.error("Error en login:", error.message);
      setError(error.message || "Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inicia Sesión:</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="****"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit">Login</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default LoginForm;
