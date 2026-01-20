import { createContext, useContext, useEffect, useState } from "react";

const BankContext = createContext();

const USERS_KEY = "imatp_users";
const CURRENT_KEY = "imatp_current_user";
const UNREAD_KEY = "imatp_unread";

export function BankProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [unread, setUnread] = useState(false);

  // 🔄 Load storage
  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem(USERS_KEY)) || []);
    setCurrentUser(JSON.parse(localStorage.getItem(CURRENT_KEY)));
    setUnread(JSON.parse(localStorage.getItem(UNREAD_KEY)) || false);
  }, []);

  // 💾 Persist
  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(UNREAD_KEY, JSON.stringify(unread));
  }, [unread]);

  // 👤 AUTH
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

  // 💸 TRANSFERENCIA
  const transfer = (toUsername, amount) => {
    amount = Number(amount);
    if (amount <= 0 || currentUser.balance < amount) return;

    const updatedUsers = users.map(u => {
      if (u.username === currentUser.username) {
        return {
          ...u,
          balance: u.balance - amount,
          movements: [
            ...u.movements,
            { text: `Transferencia a ${toUsername}`, amount: -amount }
          ]
        };
      }

      if (u.username === toUsername) {
        return {
          ...u,
          balance: u.balance + amount,
          movements: [
            ...u.movements,
            { text: `Transferencia de ${currentUser.username}`, amount }
          ]
        };
      }

      return u;
    });

    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.username === currentUser.username));
  };

  // 💬 MENSAJE
  const sendMessage = (to, text) => {
    const updatedUsers = users.map(u => {
      if (u.username === to || u.username === currentUser.username) {
        return {
          ...u,
          messages: [
            ...u.messages,
            {
              type: "text",
              from: currentUser.username,
              to,
              text,
              time: new Date().toLocaleTimeString()
            }
          ]
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    setUnread(true);
  };

  // 💰 SOLICITUD DE DINERO
  const requestMoney = (to, amount, reason) => {
    const updatedUsers = users.map(u => {
      if (u.username === to || u.username === currentUser.username) {
        return {
          ...u,
          messages: [
            ...u.messages,
            {
              type: "request",
              from: currentUser.username,
              to,
              amount: Number(amount),
              reason,
              status: "pending",
              time: new Date().toLocaleTimeString()
            }
          ]
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    setUnread(true);
  };

  // ✅ RESPONDER SOLICITUD
  const respondRequest = (index, accepted) => {
    const updatedUsers = users.map(u => {
      // receptor
      if (u.username === currentUser.username) {
        const msg = u.messages[index];
        if (!msg || msg.type !== "request" || msg.status !== "pending") return u;

        const updatedMsg = {
          ...msg,
          status: accepted ? "accepted" : "rejected"
        };

        let newUser = {
          ...u,
          messages: u.messages.map((m, i) => (i === index ? updatedMsg : m))
        };

        if (accepted) {
          newUser.balance -= msg.amount;
          newUser.movements = [
            ...newUser.movements,
            { text: `Transferencia a ${msg.from}`, amount: -msg.amount }
          ];
        }

        return newUser;
      }

      // emisor
      if (accepted && u.username === users.find(us => us.messages[index]?.from)?.messages[index]?.from) {
        return {
          ...u,
          balance: u.balance + users.find(us => us.messages[index])?.messages[index]?.amount,
          movements: [
            ...u.movements,
            { text: `Transferencia de ${currentUser.username}`, amount: users.find(us => us.messages[index])?.messages[index]?.amount }
          ]
        };
      }

      return u;
    });

    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.username === currentUser.username));
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
