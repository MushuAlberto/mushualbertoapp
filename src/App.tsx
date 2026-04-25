
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
import Chat from "@/pages/Chat";
import Store from "@/pages/Store";
import ExpensesPage from "./pages/Expenses";
import NotFound from "./pages/NotFound";
import Achievements from "./pages/Achievements";
import JournalPage from "@/pages/Journal";
import Wellbeing from "@/pages/Wellbeing";
import Therapy from "@/pages/Therapy";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/productivity" element={<Productivity />} />
              <Route path="/quick-notes" element={<QuickNotes />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/store" element={<Store />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/therapy" element={<Therapy />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/wellbeing" element={<Wellbeing />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
