import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Hub from "@/pages/Hub";
import Blacklist from "@/pages/Blacklist";
import BlacklistPublica from "@/pages/BlacklistPublica";
import JuntateaNos from "@/pages/JuntateaNos";
import Logs from "@/pages/Logs";
import Superiores from "@/pages/Superiores";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Páginas públicas — sem login */}
      <Route path="/blacklist-pub" element={<BlacklistPublica />} />
      <Route path="/junta-te" element={<JuntateaNos />} />
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />

      {/* Redireciona raiz para hub (protegido) */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout><Hub /></Layout>
        </ProtectedRoute>
      } />

      {/* Blacklist interna com gestão (só PSP) */}
      <Route path="/blacklist" element={
        <ProtectedRoute>
          <Layout><Blacklist /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/logs" element={
        <ProtectedRoute requireSuperior>
          <Layout><Logs /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/superiores" element={
        <ProtectedRoute requireSuperior>
          <Layout><Superiores /></Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
