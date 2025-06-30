import { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  PieChart,
  User,
  Ticket,
  Menu,
  BarChart2,
  TrendingUp,
  Wallet,
  Settings,
  CreditCard,
  LogOut,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "@/components/Logo";
import { useUser } from "@/contexts/UserContext";

export default function AdvertiserLayout() {
  const { logout, user } = useUser();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [defaultOpen, setDefaultOpen] = useState(true);

  // On mobile, sidebar starts closed by default
  useEffect(() => {
    setDefaultOpen(!isMobile);
  }, [isMobile]);

  const isActivePath = (path: string) => {
    return location.pathname.includes(path);
  };

  const getPageTitle = () => {
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Custom title mappings
    const titleMap: Record<string, string> = {
      dashboard: "Overview",
      reports: "Campaign Reports",
      profile: "Account Settings",
      support: "Support Center",
      campaigns: "Campaign Management",
      performance: "Performance Analytics",
      billing: "Billing & Payments",
      "global-postback": "Global Postback",
      "tracking-setup": "Tracking Setup",
    };

    if (lastSegment && titleMap[lastSegment]) {
      return titleMap[lastSegment];
    }

    return (
      lastSegment?.charAt(0).toUpperCase() +
        lastSegment?.slice(1).replace(/-/g, " ") || "Dashboard"
    );
  };

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="flex items-center justify-center p-4">
            <Logo size="md" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-4">Main</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/advertiser/dashboard"
                      className={
                        isActivePath("/advertiser/dashboard") &&
                        !location.pathname.includes("/advertiser/dashboard/")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <LayoutDashboard size={20} />
                      <span>Overview</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/advertiser/dashboard/campaigns"
                      className={
                        isActivePath("/advertiser/dashboard/campaigns")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <BarChart2 size={20} />
                      <span>Campaigns</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/advertiser/dashboard/performance"
                      className={
                        isActivePath("/advertiser/dashboard/performance")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <TrendingUp size={20} />
                      <span>Performance</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/advertiser/dashboard/reports"
                      className={
                        isActivePath("/advertiser/dashboard/reports")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <PieChart size={20} />
                      <span>Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem> */}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="px-4">Finances</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/advertiser/dashboard/billing"
                      className={
                        isActivePath("/advertiser/dashboard/billing")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <CreditCard size={20} />
                      <span>Billing</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="px-4">
                Tracking & Integration
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/advertiser/dashboard/global-postback"
                      className={
                        isActivePath("/advertiser/dashboard/global-postback")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <Settings size={20} />
                      <span>Global Postback</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/advertiser/dashboard/tracking-setup"
                      className={
                        isActivePath("/advertiser/dashboard/tracking-setup")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <Wallet size={20} />
                      <span>Tracking Setup</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="px-4">Settings</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/advertiser/dashboard/profile"
                      className={
                        isActivePath("/advertiser/dashboard/profile")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <User size={20} />
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/advertiser/dashboard/support"
                      className={
                        isActivePath("/advertiser/dashboard/support")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <Ticket size={20} />
                      <span>Support</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 text-xs text-center text-muted-foreground">
            Advertiser Dashboard v1.0
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="p-3 md:p-6 overflow-x-hidden">
          <header className="flex justify-between items-center mb-4 md:mb-8">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden">
                <Menu size={20} />
              </SidebarTrigger>
              <h1 className="text-lg md:text-xl font-bold text-foreground">
                {getPageTitle()}
              </h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                to="/advertiser/dashboard/billing"
                className="hidden md:flex items-center px-4 py-1.5 bg-purple-50 border border-purple-100 rounded-full text-purple-600 font-medium"
              >
                <DollarSign size={16} className="mr-1" />
                <span>{user?.available_balance ?? 0}</span>
              </Link>
              <ThemeToggle />
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={logout}
                className="flex items-center gap-1"
              >
                <LogOut size={isMobile ? 14 : 16} />
                <span className={isMobile ? "sr-only" : ""}>Logout</span>
              </Button>
            </div>
          </header>
          <main className="w-full">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
