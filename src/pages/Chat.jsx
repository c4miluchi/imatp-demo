import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useBank } from "../context/BankContext";

export default function Chat() {
  const {
    users,
    currentUser,
    sendMessage,
    requestMoney,
    respondRequest,
    clearUnread
  } = useBank();

  const [to, setTo] = useState("");
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  // 👉 cuando entro al chat, limpio la alerta
  useEffect(() => {
    clearUnread();
  }, []);

  const messages =
    currentUser.messages?.filter(
      m =>
        (m.from === currentUser.username && m.to === to) ||
        (m.from === to && m.to === currentUser.username)
    ) || [];

  // scroll automático al último mensaje
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!to || !text.trim()) return;
    sendMessage(to, text);
    setText("");
  };

  const handleRequest = () => {
    if (!to) return;
    const amount = prompt("Monto a solicitar:");
    if (!amount) return;
    const reason = prompt("Motivo:");
    requestMoney(to, amount, reason || "");
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h2>Chat</h2>

          <label>Usuario</label>
          <select value={to} onChange={e => setTo(e.target.value)}>
            <option value="">Elegir usuario</option>
            {users
              .filter(u => u.username !== currentUser.username)
              .map(u => (
                <option key={u.id} value={u.username}>
                  {u.username}
                </option>
              ))}
          </select>

          {to && (
            <>
              <div className="chat-container">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`message ${
                      m.from === currentUser.username ? "me" : "other"
                    }`}
                  >
                    {m.type === "text" && (
                      <>
                        {m.text}
                        <div className="message-time">{m.time}</div>
                      </>
                    )}

                    {m.type === "request" && (
                      <div className="request-box">
                        <b>Solicitud de dinero</b>
                        <p>Monto: ${m.amount}</p>
                        <p>Motivo: {m.reason}</p>
                        <small>Estado: {m.status}</small>

                        {m.to === currentUser.username &&
                          m.status === "pending" && (
                            <div className="request-actions">
                              <button
                                className="btn"
                                onClick={() => respondRequest(i, true)}
                              >
                                Aceptar
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => respondRequest(i, false)}
                              >
                                Rechazar
                              </button>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "12px"
                }}
              >
                <input
                  placeholder="Escribí un mensaje…"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <button className="btn" onClick={handleSend}>
                  Enviar
                </button>
                <button className="btn" onClick={handleRequest}>
                  💸 Solicitar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
