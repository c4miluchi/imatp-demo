import Navbar from "../components/Navbar";
import { useBank } from "../context/BankContext";

export default function Movements() {
  const { currentUser } = useBank();

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h2>Movimientos</h2>

          {currentUser.movements.length === 0 && (
            <p>No hay movimientos aún</p>
          )}

          {currentUser.movements.map((m, i) => (
            <p key={i}>
              {m.text} —{" "}
              <span
                className={
                  m.amount > 0 ? "amount-positive" : "amount-negative"
                }
              >
                {m.amount > 0 ? "+" : ""}
                ${Math.abs(m.amount)}
              </span>
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
