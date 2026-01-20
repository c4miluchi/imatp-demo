import { createContext, useContext, useEffect, useState } from "react";

const BankContext = createContext();

const USERS_KEY = "imatp_users";
const CURRENT_KEY = "imatp_current_user";

export function BankProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const storedCurrent = JSON.parse(localStorage.getItem(CURRENT_KEY));
    setUsers(storedUsers);
    setCurrentUser(storedCurrent);
  }, []);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  const register = (username, password) => {
    if (users.find(u => u.username === username)) return false;

    const newUser = {
      id: crypto.randomUUID(),
      username,
      password,
      balance: 10000,
      movements: [],
      messages: []
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const login = (username, password) => {
    const user = users.find(
      u => u.username === username && u.password === password
    );
    if (!user) return false;
    setCurrentUser(user);
    return true;
  };

  const logout = () => setCurrentUser(null);

  const transfer = (toUsername, amount) => {
    amount = Number(amount);
    if (amount <= 0) return;

    setUsers(users.map(u => {
      if (u.username === currentUser.username) {
        u.balance -= amount;
        u.movements.push({ text: `Transferencia a ${toUsername}`, amount: -amount });
      }
      if (u.username === toUsername) {
        u.balance += amount;
        u.movements.push({ text: `Transferencia de ${currentUser.username}`, amount });
      }
      return u;
    }));

    setCurrentUser({
      ...currentUser,
      balance: currentUser.balance - amount
    });
  };

  const sendMessage = (to, text) => {
    setUsers(users.map(u => {
      if (u.username === to || u.username === currentUser.username) {
        u.messages.push({
          from: currentUser.username,
          to,
          text,
          time: new Date().toLocaleTimeString()
        });
      }
      return u;
    }));
  };

  return (
    <BankContext.Provider value={{
      users,
      currentUser,
      register,
      login,
      logout,
      transfer,
      sendMessage
    }}>
      {children}
    </BankContext.Provider>
  );
}

export const useBank = () => useContext(BankContext);
