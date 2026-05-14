'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useAuth } from '@/features/auth/context'
import { AdminSkeleton } from './admin-skeleton'
import { MobileSkeleton } from './mobile-skeleton'

type AllowedRole = 'admin' | 'member'

interface RouteGuardProps {
  allow: AllowedRole
  children: React.ReactNode
}

export function RouteGuard({ allow, children }: RouteGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace(`/${locale}/auth/sign-in`)
      return
    }

    const role = user.membership?.role
    const isAdmin = role === 'owner' || role === 'admin'

    if (allow === 'admin' && !isAdmin) {
      router.replace(`/${locale}/m/home`)
    }
    if (allow === 'member' && isAdmin) {
      router.replace(`/${locale}/dashboard`)
    }
  }, [user, isLoading, allow, locale, router])

  // Show context-appropriate skeleton while auth resolves
  if (isLoading) {
    return allow === 'admin' ? <AdminSkeleton /> : <MobileSkeleton />
  }

  // Redirect in progress — keep skeleton on screen instead of flash
  if (!user) {
    return allow === 'admin' ? <AdminSkeleton /> : <MobileSkeleton />
  }

  const role = user.membership?.role
  const isAdmin = role === 'owner' || role === 'admin'

  if (allow === 'admin' && !isAdmin) return <MobileSkeleton />
  if (allow === 'member' && isAdmin) return <AdminSkeleton />

  return <>{children}</>
}
