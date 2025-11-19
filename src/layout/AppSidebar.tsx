import { 
  Utensils, 
  Tag, 
  Store, 
  Briefcase, 
  Images, 
  Users, 
  UserCircle,
  LogOut 
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

// Menu items untuk Manajemen Konten
const contentManagementItems = [
  {
    title: "Menu Tursina",
    url: "#",
    icon: Utensils,
  },
  {
    title: "Promo",
    url: "#",
    icon: Tag,
  },
  {
    title: "Outlet",
    url: "#",
    icon: Store,
  },
  {
    title: "Karir",
    url: "#",
    icon: Briefcase,
  },
  {
    title: "Galeri Tursina",
    url: "#",
    icon: Images,
  },
]

// Menu items untuk Manajemen Pengguna
const userManagementItems = [
  {
    title: "Pengguna",
    url: "#",
    icon: Users,
  },
  {
    title: "Member Tursina",
    url: "#",
    icon: UserCircle,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      {/* Sidebar Header */}
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white">
            <Utensils className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Tursina Kebab</h1>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Manajemen Konten Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Manajemen Konten</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentManagementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Manajemen Pengguna Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Manajemen Pengguna</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userManagementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <UserCircle className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">Admin Tursina</p>
            <p className="text-xs text-muted-foreground truncate">admin@tursinakebab.com</p>
          </div>
          <button className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-gray-100 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}