import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Sparkles,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "لوحة التحكم", url: "/", icon: LayoutDashboard },
  { title: "المنتجات", url: "/products", icon: Package },
  { title: "الطلبات", url: "/orders", icon: ShoppingCart },
  { title: "العملاء", url: "/customers", icon: Users },
  { title: "التوصيات", url: "/recommendations", icon: Sparkles },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-lg shrink-0">
          M
        </div>
        {!collapsed && (
          <div className="animate-slide-in">
            <h2 className="font-bold text-sidebar-accent-foreground text-sm">متجري</h2>
            <p className="text-xs text-sidebar-muted">لوحة التحكم</p>
          </div>
        )}
      </div>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <NavLink
                        to={item.url}
                        end
                        className="gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-primary/15 text-sidebar-primary font-semibold"
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                        {!collapsed && isActive && (
                          <ChevronRight className="h-4 w-4 mr-auto" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="الإعدادات">
              <button className="gap-3 px-3 py-2 rounded-lg w-full text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                <Settings className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="text-sm">الإعدادات</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="تسجيل الخروج">
              <button className="gap-3 px-3 py-2 rounded-lg w-full text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="text-sm">تسجيل الخروج</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
