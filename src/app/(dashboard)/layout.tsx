import { MainLayout } from '@/components/layout/MainLayout'
import { QueryProvider } from '@/lib/providers/QueryProvider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <MainLayout>{children}</MainLayout>
    </QueryProvider>
  )
}