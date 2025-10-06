import { useState } from "react";
import { AuthModal } from "../AuthModal";
import { ThemeProvider } from "../ThemeProvider";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

export default function AuthModalExample() {
  const [open, setOpen] = useState(true);

  return (
    <ThemeProvider>
      <div className="p-8 min-h-screen bg-background">
        <Button onClick={() => setOpen(true)}>Open Auth Modal</Button>
        <AuthModal
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            console.log("Auth success");
            setOpen(false);
          }}
        />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
