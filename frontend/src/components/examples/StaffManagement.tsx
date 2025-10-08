import { StaffManagement } from "../StaffManagement";
import { ThemeProvider } from "../ThemeProvider";

export default function StaffManagementExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background p-6">
        <StaffManagement userId={"example-user-id"} />
      </div>
    </ThemeProvider>
  );
}
