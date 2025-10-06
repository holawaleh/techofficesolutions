import { Dashboard } from "../Dashboard";
import { ThemeProvider } from "../ThemeProvider";

export default function DashboardExample() {
  return (
    <ThemeProvider>
      <Dashboard interests={["hospitality", "commerce", "tourism"]} />
    </ThemeProvider>
  );
}
