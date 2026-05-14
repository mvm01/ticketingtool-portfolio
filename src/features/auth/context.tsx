'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { AuthUser } from '@/types'
import {
  mockProfile,
  mockMemberProfile,
  mockOrg,
  mockMembership,
  mockMemberMembership,
} from '@/lib/mock/data'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  getHomeRoute: (locale: string) => string
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'restaurantops_auth'

// Determines the correct home route based on role
function homeRouteForRole(role: string | undefined, locale: string): string {
  if (role === 'owner' || role === 'admin') return `/${locale}/dashboard`
  return `/${locale}/m/home`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  async function signIn(email: string, _password: string) {
    await new Promise((r) => setTimeout(r, 800))

    // Mock: staff email gets member role, everything else gets owner
    const isMember = email.includes('staff') || email.includes('member')
    const profile = isMember ? { ...mockMemberProfile, email } : { ...mockProfile, email }
    const membership = isMember ? mockMemberMembership : mockMembership

    const authUser: AuthUser = {
      id: profile.id,
      email,
      profile,
      membership,
      organization: mockOrg,
    }
    setUser(authUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
  }

  async function signUp(email: string, _password: string, fullName: string) {
    await new Promise((r) => setTimeout(r, 1000))
    const authUser: AuthUser = {
      id: mockProfile.id,
      email,
      profile: { ...mockProfile, email, fullName },
      membership: mockMembership,
      organization: mockOrg,
    }
    setUser(authUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
  }

  async function signOut() {
    await new Promise((r) => setTimeout(r, 400))
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  function getHomeRoute(locale: string): string {
    return homeRouteForRole(user?.membership?.role, locale)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, getHomeRoute }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
