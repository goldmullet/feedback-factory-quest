
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FeedbackProvider } from "./context/FeedbackContext";
import { AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import BrandDashboard from "./pages/BrandDashboard";
import ConsumerFeedback from "./pages/ConsumerFeedback";
import Setup from "./pages/Setup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/brand/dashboard" element={<BrandDashboard />} />
        <Route path="/brand/setup" element={<Setup />} />
        <Route path="/consumer" element={<ConsumerFeedback />} />
        <Route path="/consumer/:questionId" element={<ConsumerFeedback />} />
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
      <FeedbackProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </FeedbackProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
