import React, { createContext, useContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getUserRole } from "@/lib/roles";

interface UserData {
  uid: string;
  username: string;
  role: string;
}

interface AuthContextType {
  currentUser: UserData | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registrarLog: (acao: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserData | null>(() => {
    const stored = localStorage.getItem("loggedUser");
    return stored ? JSON.parse(stored) : null;
  });

  const registrarLog = async (acao: string) => {
    const user = currentUser || JSON.parse(localStorage.getItem("loggedUser") || "null");
    try {
      await addDoc(collection(db, "logs"), {
        usuario: user ? user.username : "Sistema",
        cargo: user ? user.role : "N/A",
        acao,
        timestamp: serverTimestamp(),
        data: new Date().toLocaleDateString("pt-PT"),
        hora: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
      });
    } catch (e) {
      console.error("Erro ao gerar log:", e);
    }
  };

  const login = async (username: string, password: string) => {
    const u = username.trim().toLowerCase();
    const email = u + "@psp.com";
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const role = getUserRole(u);
    const userData: UserData = {
      uid: cred.user.uid,
      username: u.charAt(0).toUpperCase() + u.slice(1),
      role,
    };
    localStorage.setItem("loggedUser", JSON.stringify(userData));
    setCurrentUser(userData);
    // Log after setting
    try {
      await addDoc(collection(db, "logs"), {
        usuario: userData.username,
        cargo: userData.role,
        acao: "Iniciou sessão",
        timestamp: serverTimestamp(),
        data: new Date().toLocaleDateString("pt-PT"),
        hora: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
      });
    } catch (_) {}
  };

  const logout = async () => {
    await registrarLog("Encerrou a sessão (Logout)");
    await signOut(auth);
    localStorage.removeItem("loggedUser");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, registrarLog }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
