import { Link } from "react-router-dom";
import { useBank } from "../context/BankContext";

export default function Navbar() {
  const { logout } = useBank();

  return (
    <nav>
      <Link to="/">Inicio</Link> |{" "}
      <Link to="/chat">Chat</Link> |{" "}
      <Link to="/transfer">Transferir</Link> |{" "}
      <Link to="/movements">Movimientos</Link> |{" "}
      <button onClick={logout}>Salir</button>
    </nav>
  );
}
