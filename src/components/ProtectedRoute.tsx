import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isSuperior } from "@/lib/roles";

interface ProtectedRouteProps {
  children: ReactNode;
  requireSuperior?: boolean;
}

export default function ProtectedRoute({ children, requireSuperior }: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (requireSuperior && !isSuperior(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
