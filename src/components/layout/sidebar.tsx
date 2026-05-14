'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { LayoutDashboard, AlertTriangle, Users, Settings, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/context'

interface NavItem {
  key: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'incidents', href: '/incidents', icon: AlertTriangle },
  { key: 'team', href: '/team', icon: Users },
  { key: 'settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <Zap className="sidebar__brand-icon" />
        <span className="sidebar__brand-name">RestaurantOps</span>
      </div>

      {user?.organization && (
        <div className="sidebar__org">
          <span className="sidebar__org-name">{user.organization.name}</span>
        </div>
      )}

      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const Icon = item.icon
          const href = `/${locale}${item.href}`
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={item.key}
              href={href}
              className={cn('sidebar__nav-item', isActive && 'sidebar__nav-item--active')}
            >
              <Icon className="sidebar__nav-icon" />
              <span>{t(item.key as 'dashboard' | 'incidents' | 'team' | 'settings')}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
