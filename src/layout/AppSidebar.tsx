import {
  Tag,
  Store,
  Briefcase,
  Images,
  Users,
  UserCircle,
  LogOut,
  Utensils,
  LayoutDashboard,
  Settings,
  ChevronDown
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

// Define types untuk menu items
type UserRole = 'superadmin' | 'admin' | 'membership'

interface MenuItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

// Menu items untuk Dashboard dan Manajemen Konten
const mainItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ['superadmin', 'admin', 'membership']
  },
]

const contentManagementItems: MenuItem[] = [
  {
    title: "Menu Tursina",
    url: "menu-tursina",
    icon: Utensils,
    roles: ['superadmin', 'admin']
  },
  {
    title: "Promo",
    url: "promo",
    icon: Tag,
    roles: ['superadmin', 'admin']
  },
  {
    title: "Outlet",
    url: "outlet",
    icon: Store,
    roles: ['superadmin', 'admin']
  },
  {
    title: "Karir",
    url: "karir",
    icon: Briefcase,
    roles: ['superadmin', 'admin']
  },
  {
    title: "Galeri Tursina",
    url: "galeri-tursina",
    icon: Images,
    roles: ['superadmin', 'admin']
  },
]

// Menu items untuk Manajemen Pengguna
const userManagementItems: MenuItem[] = [
  {
    title: "Pengguna",
    url: "pengguna",
    icon: Users,
    roles: ['superadmin']
  },
  {
    title: "Member Tursina",
    url: "member-tursina",
    icon: UserCircle,
    roles: ['superadmin', 'admin', 'membership']
  },
]

export function AppSidebar() {
  const { logout, user } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  // Filter menu items berdasarkan role user
  const filterMenuByRole = (items: MenuItem[]): MenuItem[] => {
    if (!user?.role) return []
    return items.filter(item => item.roles.includes(user.role as UserRole))
  }

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLogoutDialogOpen(true)
    setIsDropdownOpen(false)
  }

  const handleConfirmLogout = () => {
    console.log('Logout confirmed')
    logout()
    window.location.href = '/'
  }

  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false)
  }

  const handleGantiPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Ganti Password clicked')
    window.location.href = '/ganti-password'
  }

  // Dapatkan menu yang sudah difilter berdasarkan role
  const filteredMainItems = filterMenuByRole(mainItems)
  const filteredContentItems = filterMenuByRole(contentManagementItems)
  const filteredUserItems = filterMenuByRole(userManagementItems)



  return (
    <>
      <Sidebar>
        {/* Sidebar Header */}
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
              <Image
                src="/images/logo-tursina.png"
                alt="Tursina Kebab Logo"
                className="h-10 w-10 object-contain"
                width={40}
                height={40}
              />
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
          {filteredMainItems.length > 0 && (
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMainItems.map((item) => (
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
          )}

          {/* Manajemen Konten Section - hanya tampil jika ada menu yang bisa diakses */}
          {filteredContentItems.length > 0 && (
            <>
              <SidebarGroupLabel>Manajemen Konten</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredContentItems.map((item) => (
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
            </>
          )}

          {/* Manajemen Pengguna Section - hanya tampil jika ada menu yang bisa diakses */}
          {filteredUserItems.length > 0 && (
            <>
              <SidebarGroupLabel>Manajemen Pengguna</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredUserItems.map((item) => (
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
            </>
          )}
        </SidebarContent>

        {/* Sidebar Footer dengan Dropdown */}
        <SidebarFooter className="border-t p-4">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-2 h-auto hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    <UserCircle className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-medium text-sm truncate">{user?.name || 'Admin Tursina'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@tursinakebab.com'}</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              alignOffset={-10}
              className="w-56"
            >
              <DropdownMenuItem onClick={handleGantiPassword} className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                <span>Ganti Password</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogoutClick} 
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Confirm Logout Dialog */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin logout dari sistem? Anda harus login kembali untuk mengakses admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelLogout}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ya, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}