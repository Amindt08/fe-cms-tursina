import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'

export const metadata: Metadata = {
  title: 'CMS Tursina Kebab',
  description: 'Content Management System for Website tursinakebab.id',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
            {children} 
        </AuthProvider>
      </body>
    </html>
  )
}