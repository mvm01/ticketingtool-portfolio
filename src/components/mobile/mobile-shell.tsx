import { MobileHeader } from './mobile-header'
import { BottomTabs } from './bottom-tabs'

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-shell">
      <MobileHeader />
      <main className="mobile-shell__content">{children}</main>
      <BottomTabs />
    </div>
  )
}
