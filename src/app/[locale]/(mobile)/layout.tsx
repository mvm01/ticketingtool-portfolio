import { MobileShell } from '@/components/mobile/mobile-shell'
import { RouteGuard } from '@/components/shared/route-guard'

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allow="member">
      <MobileShell>{children}</MobileShell>
    </RouteGuard>
  )
}
