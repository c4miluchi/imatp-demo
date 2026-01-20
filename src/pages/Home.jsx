import Navbar from "../components/Navbar";
import { useBank } from "../context/BankContext";

export default function Home() {
  const { currentUser } = useBank();

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h2>Bienvenido, {currentUser.username}</h2>
          <h3>Dinero disponible</h3>
          <h1>${currentUser.balance.toLocaleString()}</h1>
        </div>
      </div>
    </>
  );
}
