'use client'

import * as React from "react"
import { AppSidebar } from "./AppSidebar"
import { AppHeader } from "./AppHeader"
import { AuthProvider } from "@/contexts/auth-context"
import { AppSidebarProvider } from "@/providers/sidebar-provider"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AuthProvider>
      <AppSidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <AppHeader />
            <div className="flex-1 overflow-auto pt-16">
              {children}
            </div>
          </main>
        </div>
      </AppSidebarProvider>
    </AuthProvider>

  )
}

