import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardOverview from "./pages/DashboardOverview";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
