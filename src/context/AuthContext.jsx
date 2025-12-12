import React, { createContext, useContext, useEffect, useState } from "react";

const CURRENT_USER_KEY = "themet_current_user";
const USERS_KEY = "themet_users";

const AuthContext = createContext(null);

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(CURRENT_USER_KEY);
  }, [user]);

  const register = async ({ name, email, password }) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

    if (users.some((u) => u.email === email)) {
      throw new Error("Email is already registered");
    }

    const passwordHash = await hashPassword(password);

    const newUser = {
      id: Date.now(),
      name,
      email,
      passwordHash,
      role: "user",
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
  };

  const login = async ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const passwordHash = await hashPassword(password);

    const existing = users.find((u) => u.email === email && u.passwordHash === passwordHash);
    if (!existing) throw new Error("Invalid email or password");

    setUser({
      id: existing.id,
      name: existing.name,
      email: existing.email,
      role: existing.role,
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
