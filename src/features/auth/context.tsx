'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { AuthUser } from '@/types'
import { mockProfile, mockOrg, mockMembership } from '@/lib/mock/data'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'restaurantops_auth'

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
    const authUser: AuthUser = {
      id: mockProfile.id,
      email,
      profile: { ...mockProfile, email },
      membership: mockMembership,
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

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
