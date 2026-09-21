import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    sessionStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
  const savedUser = sessionStorage.getItem("user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    sessionStorage.removeItem("user");
    return null;
  }
});

  // LOGIN
  const login = (token, userData) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));

    setToken(token);
    setUser(userData);
  };

  // LOGOUT
  const logout = () => {

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const isLoggedIn = !!token && !!user;

  const updateUser = (updatedData) => {
    setUser((currentUser) => {
      const updatedUser = {
        ...currentUser,
        ...updatedData,
      };

      sessionStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      return updatedUser;
    });
  };
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoggedIn,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// CUSTOM HOOK
export const useAuth = () => {
  return useContext(AuthContext);
};