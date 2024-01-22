import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const loadUsername = async () => {
      const savedUsername = await AsyncStorage.getItem("username");
      if (savedUsername) {
        setUsername(savedUsername);
      } else {
        setUsername("jnz121");
      }
    };
    loadUsername();
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
export const useUser = () => useContext(UserContext);
