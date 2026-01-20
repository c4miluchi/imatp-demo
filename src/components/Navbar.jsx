import { Link } from "react-router-dom";
import { useBank } from "../context/BankContext";

export default function Navbar() {
  const { logout, currentUser } = useBank();

  return (
    <div style={{
      background: "#1e3a8a",
      padding: "14px 20px",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div>
        <b>Banco Colapinto</b>
      </div>

      <div style={{ display: "flex", gap: "14px" }}>
        <Link style={{ color: "white" }} to="/">Inicio</Link>
        <Link style={{ color: "white" }} to="/chat">Chat</Link>
        <Link style={{ color: "white" }} to="/transfer">Transferir</Link>
        <Link style={{ color: "white" }} to="/movements">Movimientos</Link>
        <span>|</span>
        <span>{currentUser.username}</span>
        <button onClick={logout} style={{ background: "#dc2626" }}>
          Salir
        </button>
      </div>
    </div>
  );
}
