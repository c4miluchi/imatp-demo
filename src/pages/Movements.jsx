import Navbar from "../components/Navbar";
import { useBank } from "../context/BankContext";

export default function Movements() {
  const { currentUser } = useBank();

  return (
    <>
      <Navbar />
      <h2>Movimientos</h2>
      {currentUser.movements.map((m, i) => (
        <p key={i}>{m.text}: {m.amount}</p>
      ))}
    </>
  );
}
