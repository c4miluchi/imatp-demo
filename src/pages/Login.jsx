import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBank } from "../context/BankContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useBank();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (login(username, password)) navigate("/");
    else alert("Credenciales incorrectas");
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Usuario" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
      <p><Link to="/register">Crear usuario</Link></p>
    </div>
  );
}
