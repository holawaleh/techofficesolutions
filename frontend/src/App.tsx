import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LandingPage } from "@/components/LandingPage";
import { InterestSelection } from "@/components/InterestSelection";
import { Dashboard } from "@/components/Dashboard";
import NotFound from "@/pages/not-found";

type AppState = "landing" | "interests" | "dashboard";

function Router() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("access_token");

      if (storedUser && accessToken) {
        try {
          const userData = JSON.parse(storedUser);
          
          const response = await fetch("/api/user/local", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: userData.username,
              externalUserId: userData.id?.toString(),
              email: userData.email,
              companyName: userData.company_name,
              address: userData.address,
              phoneNumber: userData.phone_number,
            }),
          });

          if (response.ok) {
            const localUser = await response.json();
            setUserId(localUser.id);

            const interestsResponse = await fetch(`/api/user/${localUser.id}/interests`);
            if (interestsResponse.ok) {
              const interests = await interestsResponse.json();
              if (interests.length > 0) {
                setSelectedInterests(interests.map((i: any) => i.sector));
                setAppState("dashboard");
              } else {
                setAppState("interests");
              }
            }
          }
        } catch (error) {
          console.error("Error checking auth status:", error);
          setAppState("landing");
        }
      } else {
        setAppState("landing");
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleAuthSuccess = async (localUser: any) => {
    setUserId(localUser.id);

    try {
      const interestsResponse = await fetch(`/api/user/${localUser.id}/interests`);
      if (interestsResponse.ok) {
        const interests = await interestsResponse.json();
        if (interests.length > 0) {
          setSelectedInterests(interests.map((i: any) => i.sector));
          setAppState("dashboard");
        } else {
          setAppState("interests");
        }
      }
    } catch (error) {
      console.error("Error checking interests:", error);
      setAppState("interests");
    }
  };

  const handleInterestsComplete = (interests: string[]) => {
    setSelectedInterests(interests);
    setAppState("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUserId(null);
    setSelectedInterests([]);
    setAppState("landing");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/">
        {appState === "landing" && (
          <LandingPage onAuthSuccess={handleAuthSuccess} />
        )}
        {appState === "interests" && userId && (
          <InterestSelection userId={userId} onComplete={handleInterestsComplete} />
        )}
        {appState === "dashboard" && userId && (
          <Dashboard 
            userId={userId} 
            interests={selectedInterests} 
            onLogout={handleLogout}
          />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Router />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
