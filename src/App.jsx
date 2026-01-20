import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BankProvider } from "./context/BankContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Transfer from "./pages/Transfer";
import Movements from "./pages/Movements";

export default function App() {
  return (
    <ThemeProvider>
      <BankProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
            <Route path="/movements" element={<ProtectedRoute><Movements /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </BankProvider>
    </ThemeProvider>
  );
}
