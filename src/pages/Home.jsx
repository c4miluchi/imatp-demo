import Navbar from "../components/Navbar";
import { useBank } from "../context/BankContext";

export default function Home() {
  const { currentUser } = useBank();

  return (
    <>
      <Navbar />
      <h2>Bienvenido {currentUser.username}</h2>
      <h3>Saldo: ${currentUser.balance}</h3>
    </>
  );
}
