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
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  AppWindow,
  List,
  Wallet,
  PieChart,
  FileText,
  User,
  Ticket,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "@/components/Logo";
import { useUser } from "@/contexts/UserContext";

export default function PublisherLayout() {
  const { logout } = useUser();
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
      "my-apps": "My Applications",
      "available-offers": "Available Offers",
      "all-offers": "All Offers",
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
                      to="/publisher/dashboard"
                      className={
                        isActivePath("/publisher/dashboard") &&
                        !location.pathname.includes("/publisher/dashboard/")
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
                      to="/publisher/dashboard/my-apps"
                      className={
                        isActivePath("/publisher/dashboard/my-apps")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <AppWindow size={20} />
                      <span>My Applications</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/publisher/dashboard/available-offers"
                      className={
                        isActivePath("/publisher/dashboard/available-offers")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <List size={20} />
                      <span>Available Offers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/publisher/dashboard/billing"
                      className={
                        isActivePath("/publisher/dashboard/billing")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <Wallet size={20} />
                      <span>Billing</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/publisher/dashboard/reports"
                      className={
                        isActivePath("/publisher/dashboard/reports")
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
              <SidebarGroupLabel className="px-4">Settings</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/publisher/dashboard/profile"
                      className={
                        isActivePath("/publisher/dashboard/profile")
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
                      to="/publisher/dashboard/support"
                      className={
                        isActivePath("/publisher/dashboard/support")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <Ticket size={20} />
                      <span>Support</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/docs"
                      className={
                        isActivePath("/docs")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <FileText size={20} />
                      <span>Documentation</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={logout}>
                    <FileText size={20} />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 text-xs text-center text-muted-foreground">
            Publisher Dashboard v1.0
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
              <ThemeToggle />
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={logout}
              >
                {isMobile ? "Exit" : "Logout"}
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
