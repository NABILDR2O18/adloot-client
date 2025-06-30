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
  Users,
  FileText,
  User,
  Menu,
  BarChart2,
  Settings,
  Shield,
  LogOut,
  DollarSign,
  Bell,
  Flag,
  BarChart,
  Globe,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "@/components/Logo";
import { useUser } from "@/contexts/UserContext";

export default function AdminLayout() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [defaultOpen, setDefaultOpen] = useState(true);
  const { logout } = useUser();
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
      dashboard: "Admin Overview",
      advertisers: "Advertiser Management",
      publishers: "Publisher Management",
      campaigns: "All Campaigns",
      apps: "Publisher Apps",
      offers: "Offer Management",
      withdrawals: "Withdrawal Management",
      deposits: "Deposits Management",
      reports: "System Reports",
      users: "User Management",
      settings: "System Settings",
    };

    if (lastSegment && titleMap[lastSegment]) {
      return titleMap[lastSegment];
    }

    return (
      lastSegment?.charAt(0).toUpperCase() +
        lastSegment?.slice(1).replace(/-/g, " ") || "Admin Dashboard"
    );
  };

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="flex items-center justify-center p-4">
            <Logo size="md" />
            <span className="ml-2 text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
              ADMIN
            </span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-4">Overview</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/dashboard"
                      className={
                        isActivePath("/admin/dashboard") &&
                        !location.pathname.includes("/admin/dashboard/")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <LayoutDashboard size={20} />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/reports"
                      className={
                        isActivePath("/admin/reports")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <BarChart size={20} />
                      <span>Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem> */}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="px-4">
                User Management
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/advertisers"
                      className={
                        isActivePath("/admin/advertisers")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <Users size={20} />
                      <span>Advertisers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/publishers"
                      className={
                        isActivePath("/admin/publishers")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <Globe size={20} />
                      <span>Publishers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="px-4">
                Content Management
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/campaigns"
                      className={
                        isActivePath("/admin/campaigns")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <BarChart2 size={20} />
                      <span>Campaigns</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/offers"
                      className={
                        isActivePath("/admin/offers")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <DollarSign size={20} />
                      <span>Offers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/apps"
                      className={
                        isActivePath("/admin/apps")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <FileText size={20} />
                      <span>Publisher Apps</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="px-4">Financial</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/deposits"
                      className={
                        isActivePath("/admin/deposits")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <DollarSign size={20} />
                      <span>Deposits</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/withdrawal"
                      className={
                        isActivePath("/admin/withdrawal")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <DollarSign size={20} />
                      <span>Withdrawal</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/transaction"
                      className={
                        isActivePath("/admin/transaction")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <DollarSign size={20} />
                      <span>Transaction</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="px-4">System</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/settings"
                      className={
                        isActivePath("/admin/settings")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <Settings size={20} />
                      <span>System Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/support"
                      className={
                        isActivePath("/admin/support")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <MessageSquare size={20} />
                      <span>Support Tickets</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/admin/profile"
                      className={
                        isActivePath("/admin/profile")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <User size={20} />
                      <span>My Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 text-xs text-center text-muted-foreground">
            Admin Dashboard v1.0
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
              <Bell
                size={20}
                className="text-gray-500 cursor-pointer hover:text-purple-600 transition-colors"
              />
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
