import { AppLayout } from "@/layout/AppLayout"
import { AppSidebarProvider } from "@/providers/sidebar-provider"

export default function OutletLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppSidebarProvider>
      <AppLayout>
        {children}
      </AppLayout>
    </AppSidebarProvider>
  )
}