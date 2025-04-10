import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import TemplateManager from "./pages/TemplateManager"
import ApiTester from "./pages/ApiTester"
import LogoTemplates from "./pages/LogoTemplates"
import TemplateWizard from "./pages/TemplateWizard"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/templates" element={<TemplateManager />} />
          <Route path="/api-tester" element={<ApiTester />} />
          <Route path="/logo-templates" element={<LogoTemplates />} />
          <Route path="/template-wizard" element={<TemplateWizard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
