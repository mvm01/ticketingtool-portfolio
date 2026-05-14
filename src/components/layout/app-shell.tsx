'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { Sheet, SheetContent } from '@/components/ui/sheet'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-shell">
      <div className="app-shell__sidebar">
        <Sidebar />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="app-shell__mobile-sidebar p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="app-shell__main">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  )
}
