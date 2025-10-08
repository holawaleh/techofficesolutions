import { LandingPage } from "../LandingPage";
import { ThemeProvider } from "../ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

export default function LandingPageExample() {
  return (
    <ThemeProvider>
  <LandingPage onAuthSuccess={(user) => console.log("Auth success", user)} />
      <Toaster />
    </ThemeProvider>
  );
}
