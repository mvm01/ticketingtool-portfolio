import { AppShell } from '@/components/layout/app-shell'
import { RouteGuard } from '@/components/shared/route-guard'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allow="admin">
      <AppShell>{children}</AppShell>
    </RouteGuard>
  )
}
