import { useState } from "react";
import Navbar from "../components/Navbar";
import { useBank } from "../context/BankContext";

export default function Transfer() {
  const { users, transfer, currentUser } = useBank();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h2>Transferir dinero</h2>

          <label>Destinatario</label>
          <select value={to} onChange={e => setTo(e.target.value)}>
            <option value="">Seleccionar usuario</option>
            {users
              .filter(u => u.username !== currentUser.username)
              .map(u => (
                <option key={u.id} value={u.username}>
                  {u.username}
                </option>
              ))}
          </select>


          <label>Monto</label>
          <input
            type="number"
            placeholder="Ej: 5000"
            onChange={e => setAmount(e.target.value)}
          />

          <button onClick={() => transfer(to, amount)}>
            Enviar dinero
          </button>
        </div>
      </div>
    </>
  );
}
