import { LandingPage } from "../LandingPage";
import { ThemeProvider } from "../ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

export default function LandingPageExample() {
  return (
    <ThemeProvider>
      <LandingPage onGetStarted={() => console.log("Get started clicked")} />
      <Toaster />
    </ThemeProvider>
  );
}
