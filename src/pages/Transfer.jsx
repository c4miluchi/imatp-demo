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
      <h2>Transferir dinero</h2>
      <select onChange={e => setTo(e.target.value)}>
        <option>Seleccionar usuario</option>
        {users.filter(u => u.username !== currentUser.username)
          .map(u => <option key={u.id}>{u.username}</option>)}
      </select>
      <input placeholder="Monto" onChange={e => setAmount(e.target.value)} />
      <button onClick={() => transfer(to, amount)}>Enviar</button>
    </>
  );
}
