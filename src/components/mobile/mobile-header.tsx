'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Globe, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/context'
import { getInitials } from '@/lib/utils'
import { toast } from 'sonner'

export function MobileHeader() {
  const locale   = useLocale()
  const pathname = usePathname()
  const router   = useRouter()
  const tNav     = useTranslations('nav')
  const tToast   = useTranslations('toast')
  const { user, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    toast.success(tToast('signOutSuccess'))
    router.push(`/${locale}/auth/sign-in`)
  }

  function switchLocale(next: string) {
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
  }

  const initials = getInitials(user?.profile?.fullName ?? null)

  return (
    <header className="mobile-header">
      <span className="mobile-header__org">{user?.organization?.name ?? 'RestaurantOps'}</span>

      <div className="mobile-header__actions">
        <DropdownMenu>
          <DropdownMenuTrigger className="mobile-header__locale-btn">
            <Globe className="mobile-header__locale-icon" />
            <span className="mobile-header__locale-label">{locale.toUpperCase()}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => switchLocale('en')}>🇺🇸 English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchLocale('es')}>🇪🇸 Español</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="mobile-header__avatar-btn">
            <Avatar className="mobile-header__avatar">
              <AvatarFallback className="mobile-header__avatar-fallback">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div style={{ padding: '0.5rem 0.75rem' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--silver-100)' }}>
                {user?.profile?.fullName ?? 'User'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--silver-500)', marginTop: '0.125rem' }}>
                {user?.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} variant="destructive">
              <LogOut style={{ width: '0.875rem', height: '0.875rem' }} />
              {tNav('signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
