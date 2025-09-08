import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./hooks/useTheme";
import { RouteAnalyticsProvider } from "./hooks/useRouteAnalytics";
import Header from "./components/Header";
import Footer from "./components/Footer";
import URLMonitor from "./components/URLMonitor";
import URLBackupSystem from "./components/URLBackupSystem";
import Home from "./pages/Home";
import Sectors from "./pages/Sectors";
import Terminal from "./pages/Terminal";
import Packages from "./pages/Packages";
import AgroChain from "./pages/AgroChain";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Analytics from "./pages/Analytics";
import AIInterface from "./pages/AIInterface";
import Roadmap from "./pages/Roadmap";
import TwisterCubePage from "./pages/TwisterCubePage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sectors" component={Sectors} />
      <Route path="/sectors/:sector" component={Sectors} />
      <Route path="/terminal" component={Terminal} />
      <Route path="/packages" component={Packages} />
      <Route path="/agrochain" component={AgroChain} />
      <Route path="/agrochain/details" component={AgroChain} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/ai" component={AIInterface} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/twister-cube" component={TwisterCubePage} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/features" component={Home} />
      <Route path="/pricing" component={Home} />
      <Route path="/security" component={Home} />
      <Route path="/integrations" component={Home} />
      <Route path="/about" component={Home} />
      <Route path="/careers" component={Home} />
      <Route path="/press" component={Home} />
      <Route path="/contact" component={Home} />
      <Route path="/docs" component={Home} />
      <Route path="/api" component={Home} />
      <Route path="/blog" component={Home} />
      <Route path="/support" component={Home} />
      <Route path="/privacy" component={Home} />
      <Route path="/terms" component={Home} />
      <Route path="/cookies" component={Home} />
      <Route path="/gdpr" component={Home} />
      <Route path="/learn" component={Home} />
      <Route path="/subscribe/:tier" component={Packages} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouteAnalyticsProvider>
          <TooltipProvider>
            <Header />
            <Toaster />
            <URLMonitor />
            <URLBackupSystem />
            <Router />
            <Footer />
          </TooltipProvider>
        </RouteAnalyticsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
