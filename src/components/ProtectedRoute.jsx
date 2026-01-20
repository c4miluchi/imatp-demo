import { Navigate } from "react-router-dom";
import { useBank } from "../context/BankContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useBank();
  return currentUser ? children : <Navigate to="/login" />;
}
