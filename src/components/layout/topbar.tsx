'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut, Menu, Globe } from 'lucide-react'
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

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const tNav = useTranslations('nav')
  const tToast = useTranslations('toast')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
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
    <header className="topbar">
      <button className="topbar__menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu className="topbar__menu-icon" />
      </button>

      <div className="topbar__actions">
        <DropdownMenu>
          <DropdownMenuTrigger className="topbar__locale-btn">
            <Globe className="topbar__locale-icon" />
            <span className="topbar__locale-label">{locale.toUpperCase()}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => switchLocale('en')}>
              🇺🇸 English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchLocale('es')}>
              🇪🇸 Español
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="topbar__avatar-btn">
            <Avatar className="topbar__avatar">
              <AvatarFallback className="topbar__avatar-fallback">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="topbar__user-info">
              <p className="topbar__user-name">{user?.profile?.fullName ?? 'User'}</p>
              <p className="topbar__user-email">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} variant="destructive">
              <LogOut className="topbar__sign-out-icon" />
              {tNav('signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
