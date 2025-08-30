import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Add this import
import logo2 from "@/assets/logo2.png";
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Briefcase, 
  Settings, 
  Bell, 
  Search,
  User,
  LogOut,
  ChevronDown,
  Building2,
  FileText,
  BarChart3,
  Shield,
  Heart,
  MapPin,
  Phone,
  Mail,
  Plus,
  BookmarkIcon,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';

// Import shadcn/ui components
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from '@/components/ui/sidebar';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

function AppSidebar({ userRole = '', userInfo = {}, autoCollapseThreshold = 4 }) {
  const location = useLocation(); // Get current location
  
  // Helper function to check if a path is active
  const isPathActive = (path, currentPath) => {
    if (path === currentPath) return true;
    // Check if current path starts with the menu path (for sub-routes)
    return currentPath.startsWith(path) && path !== '/';
  };

  // Helper function to check if any sub-item is active
  const hasActiveSubItem = (items, currentPath) => {
    return items?.some(item => isPathActive(item.url, currentPath));
  };

  const getNavigationData = (role, userInfo) => {
    const currentPath = location.pathname;
    
    const baseData = {
      user: {
        name: userInfo.firstName || "John Doe",
        email: userInfo.email || "john@example.com",
        avatar: "/avatars/john-doe.jpg",
      },
    };

    switch (role) {
      case 'Admin':
        return {
          ...baseData,
          navMain: [
            {
              title: "Dashboard",
              url: "/admin/dashboard",
              icon: Home,
              isActive: isPathActive("/admin/dashboard", currentPath),
            },
            {
              title: "User Management",
              url: "/admin/users",
              icon: Users,
              isActive: isPathActive("/admin/users", currentPath),
              items: [
                { title: "All Users", url: "/admin/users", isActive: isPathActive("/admin/users", currentPath) },
                { title: "Admins", url: "/admin/admins", isActive: isPathActive("/admin/admins", currentPath) },
                
                { title: "Job Seekers", url: "/admin/users/seekers", isActive: isPathActive("/admin/users/seekers", currentPath) },
                { title: "Employers", url: "/admin/users/employers", isActive: isPathActive("/admin/users/employers", currentPath) },
              ],
            },
            {
              title: "Job Management",
              url: "/admin/jobs",
              icon: Briefcase,
              isActive: isPathActive("/admin/jobs", currentPath) || hasActiveSubItem([
                  { url: "/admin/jobs/pending" }, // These now logically map to filters on the main page
                  { url: "/admin/jobs/categories" },
              ], currentPath),
              items: [
                { title: "All Jobs", url: "/admin/jobs", isActive: currentPath === "/admin/jobs" && !location.pathname.includes('/pending') }, 
                { title: "Pending Approval", url: "/admin/jobs/pending", isActive: isPathActive("/admin/jobs/pending", currentPath) }, 
                { title: "Job Categories", url: "/admin/jobs/categories", isActive: isPathActive("/admin/jobs/categories", currentPath) },
              ],
            },
            {
              title: "Reports & Analytics",
              url: "/admin/reports",
              icon: BarChart3,
              isActive: isPathActive("/admin/reports", currentPath),
              items: [
                { title: "User Analytics", url: "/admin/reports/users", isActive: isPathActive("/admin/reports/users", currentPath) },
                { title: "Job Analytics", url: "/admin/reports/jobs", isActive: isPathActive("/admin/reports/jobs", currentPath) },
                { title: "Platform Stats", url: "/admin/reports/platform", isActive: isPathActive("/admin/reports/platform", currentPath) },
              ],
            },
            {
              title: "Settings",
              url: "/admin/settings",
              icon: Settings,
              isActive: isPathActive("/admin/settings", currentPath),
            },
          ],
        };

      case 'Employer':
        return {
          ...baseData,
          navMain: [
            {
              title: "Dashboard",
              url: "/employer/dashboard",
              icon: Home,
              isActive: isPathActive("/employer/dashboard", currentPath),
            },
            {
              title: "Job Management",
              url: "/employer/jobs",
              icon: Briefcase,
              isActive: isPathActive("/employer/jobs", currentPath),
              items: [
                { title: "Post New Job", url: "/employer/jobs/create", isActive: isPathActive("/employer/jobs/create", currentPath) },
                { title: "My Job Posts", url: "/employer/jobs", isActive: currentPath === "/employer/jobs" },
                { title: "Draft Jobs", url: "/employer/jobs/drafts", isActive: isPathActive("/employer/jobs/drafts", currentPath) },
              ],
            },
            {
              title: "Applications",
              url: "/employer/applications",
              icon: FileText,
              isActive: isPathActive("/employer/applications", currentPath),
              items: [
                { title: "All Applications", url: "/employer/applications", isActive: currentPath === "/employer/applications" },
                { title: "Shortlisted", url: "/employer/applications/shortlisted", isActive: isPathActive("/employer/applications/shortlisted", currentPath) },
                { title: "Interviewed", url: "/employer/applications/interviewed", isActive: isPathActive("/employer/applications/interviewed", currentPath) },
              ],
            },
            {
              title: "Company Profile",
              url: "/employer/profile",
              icon: Building2,
              isActive: isPathActive("/employer/profile", currentPath),
            },
            {
              title: "Analytics",
              url: "/employer/analytics",
              icon: BarChart3,
              isActive: isPathActive("/employer/analytics", currentPath),
            },
            {
              title: "Settings",
              url: "/employer/settings",
              icon: Settings,
              isActive: isPathActive("/employer/settings", currentPath),
            },
          ],
        };

      default: // seeker
        return {
          ...baseData,
          navMain: [
            {
              title: "Dashboard",
              url: "/jobseeker/dashboard",
              icon: Home,
              isActive: isPathActive("/jobseeker/dashboard", currentPath),
            },
            {
              title: "Find Jobs",
              url: "/jobseeker/jobs",
              icon: Search,
              isActive: isPathActive("/jobseeker/jobs", currentPath),
              items: [
                { title: "Browse All", url: "/jobseeker/jobs", isActive: currentPath === "/jobseeker/jobs" },
                { title: "Recommended", url: "/jobseeker/jobs/recommended", isActive: isPathActive("/jobseeker/jobs/recommended", currentPath) },
                { title: "Saved", url: "/jobseeker/jobs/saved", isActive: isPathActive("/jobseeker/jobs/saved", currentPath) }, 
              ],
            },
            {
              title: "My Applications",
              url: "/jobseeker/applications",
              icon: FileText,
              isActive: isPathActive("/jobseeker/applications", currentPath),
            },
            {
              title: "Profile",
              url: "/jobseeker/profile",
              icon: User,
              isActive: isPathActive("/jobseeker/profile", currentPath),
            },
            {
              title: "Settings",
              url: "/jobseeker/settings",
              icon: Settings,
              isActive: isPathActive("/jobseeker/settings", currentPath),
            },
          ],
        };
    }
  };

  const [collapsedItems, setCollapsedItems] = useState(() => {
    // Auto-collapse items that exceed the threshold
    const data = getNavigationData(userRole, userInfo);
    const initialState = {};
    data.navMain.forEach(item => {
      if (item.items?.length >= autoCollapseThreshold) {
        initialState[item.title] = true;
      }
    });
    return initialState;
  });

  const toggleCollapse = (itemTitle) => {
    setCollapsedItems(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  };

  const data = getNavigationData(userRole, userInfo);

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'employer': return 'Employer';
      default: return 'Job Seeker';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'employer': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <Sidebar variant="inset" className="border-r border-border bg-surface">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <img src={logo2} alt="SkillBridge Logo" className="h-14 w-auto" />
                
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const hasSubItems = item.items?.length > 0;
              const isCollapsed = collapsedItems[item.title];
              const hasActiveChild = hasActiveSubItem(item.items, location.pathname);
              const isItemActive = item.isActive || hasActiveChild;

              return (
                <Collapsible
                  key={item.title}
                  open={!isCollapsed}
                  onOpenChange={() => hasSubItems && toggleCollapse(item.title)}
                >
                  <SidebarMenuItem>
                    <div className="flex items-center w-full">
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title}
                        isActive={isItemActive}
                        className="data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700 data-[active=true]:border-r-2 data-[active=true]:border-blue-500 flex-1 hover:bg-gray-50"
                      >
                        <Link to={item.url} className="flex items-center">
                          <item.icon className="!size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      
                      {/* Collapse toggle button */}
                      {hasSubItems && (
                        <CollapsibleTrigger asChild>
                          <button
                            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors ml-1 flex-shrink-0"
                            aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${item.title}`}
                          >
                            {isCollapsed ? (
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </button>
                        </CollapsibleTrigger>
                      )}
                    </div>

                    {/* Collapsible sub-menu */}
                    {hasSubItems && (
                      <CollapsibleContent className="transition-all duration-200 ease-in-out">
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild
                                isActive={subItem.isActive}
                                className="data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700 data-[active=true]:font-medium"
                              >
                                <Link to={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className={`px-3 py-2 rounded-lg text-xs font-medium text-center border ${getRoleBadgeColor(userRole)}`}>
              {getRoleDisplayName(userRole)}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <a href="/profile">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-100">
                  <User className="size-4 text-blue-600" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{data.user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{data.user.email}</span>
                </div>
                <MoreHorizontal className="size-4" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;