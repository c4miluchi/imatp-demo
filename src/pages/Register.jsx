import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBank } from "../context/BankContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useBank();
  const navigate = useNavigate();

  const handleRegister = () => {
    if (register(username, password)) navigate("/");
    else alert("Usuario ya existe");
  };

  return (
    <div>
      <h2>Registro</h2>
      <input placeholder="Usuario" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Crear</button>
    </div>
  );
}
