import { useState } from "react";
import Navbar from "../components/Navbar";
import { useBank } from "../context/BankContext";

export default function Chat() {
  const { users, currentUser, sendMessage } = useBank();
  const [to, setTo] = useState("");
  const [text, setText] = useState("");

  const messages =
    currentUser.messages?.filter(
      m => (m.from === currentUser.username && m.to === to) ||
           (m.from === to && m.to === currentUser.username)
    ) || [];

  return (
    <>
      <Navbar />
      <h2>Chat</h2>

      <select onChange={e => setTo(e.target.value)}>
        <option>Elegir usuario</option>
        {users.filter(u => u.username !== currentUser.username)
          .map(u => <option key={u.id}>{u.username}</option>)}
      </select>

      <div>
        {messages.map((m, i) => (
          <p key={i}><b>{m.from}</b>: {m.text} ({m.time})</p>
        ))}
      </div>

      <input placeholder="Mensaje" onChange={e => setText(e.target.value)} />
      <button onClick={() => sendMessage(to, text)}>Enviar</button>
    </>
  );
}
