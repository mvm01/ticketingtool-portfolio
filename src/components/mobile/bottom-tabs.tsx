'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Home, Plus, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Tab {
  key: string
  href: string
  icon: React.ElementType
  labelKey: string
}

const tabs: Tab[] = [
  { key: 'home',        href: '/m/home',         icon: Home,          labelKey: 'home' },
  { key: 'report',      href: '/m/report',        icon: Plus,          labelKey: 'report' },
  { key: 'my-incidents',href: '/m/my-incidents',  icon: ClipboardList, labelKey: 'myIncidents' },
]

export function BottomTabs() {
  const locale    = useLocale()
  const pathname  = usePathname()
  const t         = useTranslations('mobile.nav')

  return (
    <nav className="bottom-tabs">
      {tabs.map(({ key, href, icon: Icon, labelKey }) => {
        const fullHref = `/${locale}${href}`
        const isActive = pathname.startsWith(fullHref)

        return (
          <Link
            key={key}
            href={fullHref}
            className={cn('bottom-tabs__item', isActive && 'bottom-tabs__item--active')}
          >
            {key === 'report' ? (
              <span className="bottom-tabs__fab">
                <Icon className="bottom-tabs__fab-icon" />
              </span>
            ) : (
              <>
                <Icon className="bottom-tabs__icon" />
                <span className="bottom-tabs__label">{t(labelKey as 'home' | 'report' | 'myIncidents')}</span>
              </>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
