import { useState } from 'react';
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
  // State to track collapsed items
  

  const getNavigationData = (role, userInfo) => {
    const baseData = {
      user: {
        name: userInfo.firstName || "John Doe",
        email: userInfo.email || "john@example.com",
        avatar: "/avatars/john-doe.jpg",
      },
    };

    switch (role) {
      case 'admin':
        return {
          ...baseData,
          navMain: [
            {
              title: "Dashboard",
              url: "/admin/dashboard",
              icon: Home,
              isActive: true,
            },
            {
              title: "User Management",
              url: "/admin/users",
              icon: Users,
              items: [
                { title: "All Users", url: "/admin/users" },
                { title: "Job Seekers", url: "/admin/users/seekers" },
                { title: "Employers", url: "/admin/users/employers" },
              ],
            },
            {
              title: "Job Management",
              url: "/admin/jobs",
              icon: Briefcase,
              items: [
                { title: "All Jobs", url: "/admin/jobs" },
                { title: "Pending Approval", url: "/admin/jobs/pending" },
                { title: "Job Categories", url: "/admin/jobs/categories" },
              ],
            },
            {
              title: "Reports & Analytics",
              url: "/admin/reports",
              icon: BarChart3,
              items: [
                { title: "User Analytics", url: "/admin/reports/users" },
                { title: "Job Analytics", url: "/admin/reports/jobs" },
                { title: "Platform Stats", url: "/admin/reports/platform" },
              ],
            },
            {
              title: "Settings",
              url: "/admin/settings",
              icon: Settings,
            },
          ],
        };

      case 'employer':
        return {
          ...baseData,
          navMain: [
            {
              title: "Dashboard",
              url: "/employer/dashboard",
              icon: Home,
              isActive: true,
            },
            {
              title: "Job Management",
              url: "/employer/jobs",
              icon: Briefcase,
              items: [
                { title: "Post New Job", url: "/employer/jobs/create" },
                { title: "My Job Posts", url: "/employer/jobs" },
                { title: "Draft Jobs", url: "/employer/jobs/drafts" },
              ],
            },
            {
              title: "Applications",
              url: "/employer/applications",
              icon: FileText,
              items: [
                { title: "All Applications", url: "/employer/applications" },
                { title: "Shortlisted", url: "/employer/applications/shortlisted" },
                { title: "Interviewed", url: "/employer/applications/interviewed" },
              ],
            },
            {
              title: "Company Profile",
              url: "/employer/profile",
              icon: Building2,
            },
            {
              title: "Analytics",
              url: "/employer/analytics",
              icon: BarChart3,
            },
            {
              title: "Settings",
              url: "/employer/settings",
              icon: Settings,
            },
          ],
        };

      default: // seeker
        return {
          ...baseData,
          navMain: [
            {
              title: "Dashboard",
              url: "/seeker/dashboard",
              icon: Home,
              isActive: true,
            },
            {
              title: "Find Jobs",
              url: "/seeker/jobs",
              icon: Search,
              items: [
                { title: "Browse All", url: "/seeker/jobs" },
                { title: "Recommended", url: "/seeker/jobs/recommended" },
                { title: "Recent", url: "/seeker/jobs/recent" },
              ],
            },
            {
              title: "My Applications",
              url: "/seeker/applications",
              icon: FileText,
              items: [
                { title: "All Applications", url: "/seeker/applications" },
                { title: "In Progress", url: "/seeker/applications/progress" },
                { title: "Interviews", url: "/seeker/applications/interviews" },
              ],
            },
            {
              title: "Saved Jobs",
              url: "/seeker/saved",
              icon: Heart,
            },
            {
              title: "Profile",
              url: "/seeker/profile",
              icon: User,
              items: [
                { title: "Personal Info", url: "/seeker/profile" },
                { title: "Resume", url: "/seeker/profile/resume" },
                { title: "Skills", url: "/seeker/profile/skills" },
              ],
            },
            {
              title: "Settings",
              url: "/seeker/settings",
              icon: Settings,
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
      case 'admin': return 'bg-danger-100 text-danger-700 border-danger-200';
      case 'employer': return 'bg-warning-100 text-warning-700 border-warning-200';
      default: return 'bg-accent-100 text-accent-700 border-accent-200';
    }
  };

  return (
    <Sidebar variant="inset" className="border-r border-border bg-surface">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-text">SkillBridge</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {getRoleDisplayName(userRole)}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-secondary-600">Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const hasSubItems = item.items?.length > 0;
              const isCollapsed = collapsedItems[item.title];

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
                        isActive={item.isActive}
                        className="data-[active=true]:bg-primary-50 data-[active=true]:text-primary-700 data-[active=true]:border-r-2 data-[active=true]:border-primary-500 flex-1"
                      >
                        <a href={item.url} className="flex items-center">
                          <item.icon className="!size-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      
                      {/* Collapse toggle button */}
                      {hasSubItems && (
                        <CollapsibleTrigger asChild>
                          <button
                            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors ml-1 flex-shrink-0"
                            aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${item.title}`}
                          >
                            {isCollapsed ? (
                              <ChevronRight className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
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
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
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
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary-100">
                  <User className="size-4 text-primary-600" />
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