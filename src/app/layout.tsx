import type { Metadata } from 'next'
import './globals.css'
import { AppLayout } from '@/layout/AppLayout'

export const metadata: Metadata = {
  title: 'Sistem Antrian Rumah Sakit - RS Sehat Sentosa',
  description: 'Sistem antrian digital rumah sakit modern dengan fitur lengkap',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  )
}