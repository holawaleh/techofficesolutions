import { useState } from "react";
import {
  Building2,
  ShoppingBag,
  Globe,
  Heart,
  Sprout,
  MoreHorizontal,
  Users,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { StaffManagement } from "./StaffManagement";
import { SectorDashboard } from "./SectorDashboard";

const sectorIcons = {
  hospitality: Building2,
  commerce: ShoppingBag,
  tourism: Globe,
  health: Heart,
  agriculture: Sprout,
  others: MoreHorizontal,
};

const sectorColors = {
  hospitality: "340 75% 55%",
  commerce: "142 70% 45%",
  tourism: "200 85% 50%",
  health: "155 65% 48%",
  agriculture: "85 60% 50%",
  others: "270 50% 55%",
};

const sectorNames = {
  hospitality: "Hospitality",
  commerce: "Commerce",
  tourism: "Tourism",
  health: "Health",
  agriculture: "Agriculture",
  others: "Others",
};

export function Dashboard({ 
  userId, 
  interests, 
  onLogout 
}: { 
  userId: string;
  interests: string[];
  onLogout: () => void;
}) {
  const [activeView, setActiveView] = useState<string>(interests[0] || "overview");
  const [isSuperuser] = useState(true);

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-bold">TechOffice</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveView("overview")}
                      isActive={activeView === "overview"}
                      data-testid="button-nav-overview"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Your Sectors</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {interests.map((interest) => {
                    const Icon = sectorIcons[interest as keyof typeof sectorIcons];
                    const color = sectorColors[interest as keyof typeof sectorColors];
                    return (
                      <SidebarMenuItem key={interest}>
                        <SidebarMenuButton
                          onClick={() => setActiveView(interest)}
                          isActive={activeView === interest}
                          data-testid={`button-nav-${interest}`}
                        >
                          <Icon className="h-4 w-4" style={{ color: `hsl(${color})` }} />
                          <span>{sectorNames[interest as keyof typeof sectorNames]}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {isSuperuser && (
              <SidebarGroup>
                <SidebarGroupLabel>Admin</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => setActiveView("staff")}
                        isActive={activeView === "staff"}
                        data-testid="button-nav-staff"
                      >
                        <Users className="h-4 w-4" />
                        <span>Staff Management</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton data-testid="button-nav-settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onLogout} data-testid="button-nav-logout">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-xl font-semibold">
                {activeView === "overview"
                  ? "Overview"
                  : activeView === "staff"
                  ? "Staff Management"
                  : sectorNames[activeView as keyof typeof sectorNames]}
              </h1>
            </div>
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6">
            {activeView === "staff" ? (
              <StaffManagement userId={userId} />
            ) : activeView === "overview" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {interests.map((interest) => {
                    const Icon = sectorIcons[interest as keyof typeof sectorIcons];
                    const color = sectorColors[interest as keyof typeof sectorColors];
                    return (
                      <button
                        key={interest}
                        onClick={() => setActiveView(interest)}
                        className="p-6 rounded-lg border bg-card hover-elevate text-left"
                        data-testid={`card-overview-${interest}`}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                          style={{
                            backgroundColor: `hsl(${color} / 0.1)`,
                          }}
                        >
                          <Icon className="h-5 w-5" style={{ color: `hsl(${color})` }} />
                        </div>
                        <h3 className="font-semibold mb-1">
                          {sectorNames[interest as keyof typeof sectorNames]}
                        </h3>
                        <p className="text-2xl font-bold">
                          {Math.floor(Math.random() * 100) + 1}
                        </p>
                        <p className="text-xs text-muted-foreground">Active items</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <SectorDashboard sector={activeView} />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
