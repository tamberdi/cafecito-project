import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userId, setUserIdState] = useState(() => {
    const stored = localStorage.getItem("cafecito_user_id");
    return stored ? parseInt(stored) : null;
  });

  function setUserId(id) {
    if (id === null) {
      localStorage.removeItem("cafecito_user_id");
    } else {
      localStorage.setItem("cafecito_user_id", id);
    }
    setUserIdState(id);
  }

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}