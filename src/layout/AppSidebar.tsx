import {
  Tag,
  Store,
  Briefcase,
  Images,
  Users,
  UserCircle,
  LogOut,
  Utensils,
  LayoutDashboard
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"


// Menu items untuk Dashboard dan Manajemen Konten
const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
]

const contentManagementItems = [
  {
    title: "Menu Tursina",
    url: "menu-tursina",
    icon: Utensils,
  },
  {
    title: "Promo",
    url: "promo",
    icon: Tag,
  },
  {
    title: "Outlet",
    url: "outlet",
    icon: Store,
  },
  {
    title: "Karir",
    url: "karir",
    icon: Briefcase,
  },
  {
    title: "Galeri Tursina",
    url: "galeri-tursina",
    icon: Images,
  },
]

// Menu items untuk Manajemen Pengguna
const userManagementItems = [
  {
    title: "Pengguna",
    url: "pengguna",
    icon: Users,
  },
  {
    title: "Member Tursina",
    url: "member-tursina",
    icon: UserCircle,
  },
]

export function AppSidebar() {
  const { logout, user } = useAuth()

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Logout button clicked')
    logout()
    // Force redirect ke halaman login
    window.location.href = '/'
  }

  return (
    <Sidebar>
      {/* Sidebar Header */}
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          {/* Ganti dengan gambar logo Tursina Kebab */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
            <Image
              src="/images/logo-tursina.png"
              alt="Tursina Kebab Logo"
              className="h-10 w-10 object-contain"
              width={40}
              height={40}
            />
            {/* Fallback icon jika gambar tidak load */}
            <div className="h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white hidden">
              <Utensils className="h-6 w-6" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg">Tursina Kebab</h1>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        {/* Main Menu - Dashboard */}
        <SidebarGroupContent>
          <SidebarMenu>
            {mainItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>

        {/* Manajemen Konten Section */}
        <SidebarGroupLabel>Manajemen Konten</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {contentManagementItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>

        {/* Manajemen Pengguna Section */}
        <SidebarGroupLabel>Manajemen Pengguna</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {userManagementItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <UserCircle className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user?.name || 'Admin Tursina'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@tursinakebab.com'}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}