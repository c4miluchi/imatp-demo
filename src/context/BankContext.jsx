import { createContext, useContext, useEffect, useState } from "react";

const BankContext = createContext();

const USERS_KEY = "imatp_users";
const CURRENT_KEY = "imatp_current_user";
const UNREAD_KEY = "imatp_unread";

export function BankProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [unread, setUnread] = useState(false);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const storedCurrent = JSON.parse(localStorage.getItem(CURRENT_KEY));
    const storedUnread = JSON.parse(localStorage.getItem(UNREAD_KEY)) || false;

    setUsers(storedUsers);
    setCurrentUser(storedCurrent);
    setUnread(storedUnread);
  }, []);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(UNREAD_KEY, JSON.stringify(unread));
  }, [unread]);

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
        u.movements.push({
          text: `Transferencia a ${toUsername}`,
          amount: -amount
        });
      }
      if (u.username === toUsername) {
        u.balance += amount;
        u.movements.push({
          text: `Transferencia de ${currentUser.username}`,
          amount
        });
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
          type: "text",
          from: currentUser.username,
          to,
          text,
          time: new Date().toLocaleTimeString()
        });
      }
      return u;
    }));

    setUnread(true);
  };

  const requestMoney = (to, amount, reason) => {
    setUsers(users.map(u => {
      if (u.username === to || u.username === currentUser.username) {
        u.messages.push({
          type: "request",
          from: currentUser.username,
          to,
          amount: Number(amount),
          reason,
          status: "pending",
          time: new Date().toLocaleTimeString()
        });
      }
      return u;
    }));

    setUnread(true);
  };

  const respondRequest = (index, accepted) => {
    setUsers(users.map(u => {
      if (u.username === currentUser.username) {
        const msg = u.messages[index];
        if (!msg || msg.type !== "request" || msg.status !== "pending") return u;

        msg.status = accepted ? "accepted" : "rejected";

        if (accepted) {
          u.balance -= msg.amount;
          u.movements.push({
            text: `Transferencia a ${msg.from}`,
            amount: -msg.amount
          });

          const sender = users.find(us => us.username === msg.from);
          sender.balance += msg.amount;
          sender.movements.push({
            text: `Transferencia de ${currentUser.username}`,
            amount: msg.amount
          });
        }
      }
      return u;
    }));
  };

  const clearUnread = () => setUnread(false);

  return (
    <BankContext.Provider value={{
      users,
      currentUser,
      unread,
      register,
      login,
      logout,
      transfer,
      sendMessage,
      requestMoney,
      respondRequest,
      clearUnread
    }}>
      {children}
    </BankContext.Provider>
  );
}

export const useBank = () => useContext(BankContext);
