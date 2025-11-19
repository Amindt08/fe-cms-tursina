import { SidebarTrigger } from "@/components/ui/sidebar"


export function AppHeader() {
  return (
    <header className="fixed w-full flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <SidebarTrigger />
      <div className="flex items-center gap-2 md:ml-auto">
      </div>
    </header>
  )
}