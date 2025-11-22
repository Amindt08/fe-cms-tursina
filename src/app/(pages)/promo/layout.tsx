import { AppLayout } from "@/layout/AppLayout"
import { AppSidebarProvider } from "@/providers/sidebar-provider"

export default function PromoLayout({
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