
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Productivity from "@/pages/Productivity";
import QuickNotes from "@/pages/QuickNotes";
import MyDiary from "@/pages/MyDiary";
import MyRewards from "@/pages/MyRewards";
import ExpensesPage from "./pages/Expenses";
import NotFound from "./pages/NotFound";
import Wellbeing from "@/pages/Wellbeing";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/productivity" element={<Productivity />} />
              <Route path="/quick-notes" element={<QuickNotes />} />
              <Route path="/diary" element={<MyDiary />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/wellbeing" element={<Wellbeing />} />
              <Route path="/rewards" element={<MyRewards />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              {/* Legacy redirects */}
              <Route path="/journal" element={<MyDiary />} />
              <Route path="/therapy" element={<MyDiary />} />
              <Route path="/chat" element={<Dashboard />} />
              <Route path="/store" element={<MyRewards />} />
              <Route path="/achievements" element={<MyRewards />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
