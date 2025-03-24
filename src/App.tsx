
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FeedbackProvider } from "./context/feedback";
import { AuthProvider } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import BrandDashboard from "./pages/BrandDashboard";
import ConsumerFeedback from "./pages/ConsumerFeedback";
import Setup from "./pages/Setup";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import SurveyResponse from "./pages/SurveyResponse";
import SurveyResponses from "./pages/SurveyResponses";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/survey/:surveyId" element={<SurveyResponse />} />
        
        {/* Protected routes */}
        <Route path="/brand/dashboard" element={
          <ProtectedRoute>
            <BrandDashboard />
          </ProtectedRoute>
        } />
        <Route path="/brand/setup" element={
          <ProtectedRoute>
            <Setup />
          </ProtectedRoute>
        } />
        <Route path="/survey-responses/:surveyId" element={
          <ProtectedRoute>
            <SurveyResponses />
          </ProtectedRoute>
        } />
        <Route path="/consumer" element={
          <ProtectedRoute>
            <ConsumerFeedback />
          </ProtectedRoute>
        } />
        <Route path="/consumer/:questionId" element={
          <ProtectedRoute>
            <ConsumerFeedback />
          </ProtectedRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <FeedbackProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </FeedbackProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
