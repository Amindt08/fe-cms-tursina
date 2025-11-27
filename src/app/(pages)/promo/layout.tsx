import { AppLayout } from "@/layout/AppLayout"
import { AppSidebarProvider } from "@/providers/sidebar-provider"
import { Toaster } from "sonner"

export default function PromoLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AppSidebarProvider>
            <AppLayout>
                <Toaster richColors position="top-right" />
                {children}
            </AppLayout>
        </AppSidebarProvider>
    )
}