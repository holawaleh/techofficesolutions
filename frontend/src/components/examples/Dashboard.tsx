import { Dashboard } from "../Dashboard";
import { ThemeProvider } from "../ThemeProvider";

export default function DashboardExample() {
  return (
    <ThemeProvider>
      <Dashboard
        userId={"example-user-id"}
        interests={["hospitality", "commerce", "tourism"]}
        onLogout={() => console.log("logout")}
      />
    </ThemeProvider>
  );
}
