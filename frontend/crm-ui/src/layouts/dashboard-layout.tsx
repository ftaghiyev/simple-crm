import { Link, Outlet, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { MdHome } from "react-icons/md";
import { LuTrendingUp, LuUsers } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { LuHousePlug } from "react-icons/lu";
import { useAuth } from "@/hooks/auth";
import { RiSidebarFoldFill } from "react-icons/ri";
import { useMediaQuery } from "react-responsive";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons/lib";

const navItems = [
  { title: "Dashboard", url: "/dashboard/home", icon: MdHome },
  {
    title: "Lead management",
    url: "/dashboard/lead-management",
    icon: LuUsers,
  },
  { title: "Analytics", url: "/dashboard/analytics", icon: LuTrendingUp },
];

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <BaseDashboardLayout />
    </SidebarProvider>
  );
}

interface SidebarNavLinkProps {
  to: string;
  icon: IconType;
  children?: React.ReactNode;
  onClick?: () => void;
}
export function SidebarNavLink({
  to,
  icon: Icon,
  children,
  onClick,
}: SidebarNavLinkProps) {
  const { pathname } = useLocation();
  const isActive = pathname.startsWith(to);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          to={to}
          onClick={onClick}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
            isActive
              ? "hover:bg-black! hover:text-white bg-black text-white"
              : ""
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function BaseDashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { open, toggleSidebar } = useSidebar();

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const currentPage = location.pathname.split("/").filter(Boolean).pop();
  const pageTitle = currentPage
    ? currentPage.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Dashboard";

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar>
        <SidebarContent>
          <div className="flex items-center gap-2 p-4">
            <LuHousePlug className="size-5 text-blue-700" />

            <span className="font-semibold text-lg tracking-tight">
              Simple CRM
            </span>
          </div>

          {/* Main menu */}
          <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarNavLink
                    key={item.url}
                    to={item.url}
                    icon={item.icon}
                    onClick={() => (isMobile ? toggleSidebar() : {})}
                  >
                    {item.title}
                  </SidebarNavLink>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator className="my-4" />

          <div className="px-4 pb-4">
            <Button
              variant="destructive"
              onClick={logout}
              className="w-full justify-start gap-2"
            >
              <FiLogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
          <div className="flex items-center">
            <RiSidebarFoldFill
              className={`size-5 m-4 ${!open ? "rotate-y-180" : ""}`}
              onClick={() => toggleSidebar()}
            />
            <h1 className="text-lg font-semibold capitalize">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user?.first_name.charAt(0)} {user?.last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
