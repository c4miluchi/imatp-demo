import { Link } from "react-router-dom";
import { useBank } from "../context/BankContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { logout, currentUser, unread } = useBank();
  const { toggleTheme } = useTheme();

  return (
    <div style={{
      background: "var(--primary)",
      padding: "14px 20px",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <b>Banco Colapinto</b>

      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
        <Link style={{ color: "white" }} to="/">Inicio</Link>

        <div className="chat-link">
          <Link style={{ color: "white" }} to="/chat">
            Chat
          </Link>
          {unread && <span className="badge" />}
        </div>

        <Link style={{ color: "white" }} to="/transfer">Transferir</Link>
        <Link style={{ color: "white" }} to="/movements">Movimientos</Link>

        <button className="btn" onClick={toggleTheme}>
          🌙 / ☀️
        </button>

        <span>{currentUser.username}</span>

        <button className="btn btn-danger" onClick={logout}>
          Salir
        </button>
      </div>
    </div>
  );
}
