'use client'

import { Sidebar } from './Sidebar'
import { AuthProvider } from '@/contexts/AuthContext'
import { ClientOnly } from '@/components/ClientOnly'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <AuthProvider>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto lg:ml-0">
            <div className="p-4 lg:p-8 pt-16 lg:pt-8">
              {children}
            </div>
          </main>
        </div>
      </AuthProvider>
    </ClientOnly>
  )
}