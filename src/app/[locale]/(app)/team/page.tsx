'use client'

import { useTranslations } from 'next-intl'
import { Users } from 'lucide-react'
import { useAuth } from '@/features/auth/context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

export default function TeamPage() {
  const t = useTranslations('team')
  const tRoles = useTranslations('team.roles')
  const { user } = useAuth()

  const members = user
    ? [
        {
          id: user.id,
          name: user.profile?.fullName ?? user.email,
          email: user.email,
          role: user.membership?.role ?? 'member',
        },
      ]
    : []

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">{t('title')}</h1>
      </div>

      {members.length === 0 ? (
        <div className="empty-state">
          <Users className="empty-state__icon" />
          <p className="empty-state__title">{t('noMembers')}</p>
        </div>
      ) : (
        <div
          style={{
            background: 'var(--brand-800)',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            maxWidth: 560,
          }}
        >
          {members.map((member) => (
            <div
              key={member.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <Avatar style={{ width: '2.25rem', height: '2.25rem' }}>
                <AvatarFallback
                  style={{
                    background: 'var(--brand-600)',
                    color: 'var(--silver-100)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                  }}
                >
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--silver-100)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {member.name}
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--silver-500)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {member.email}
                </p>
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--brand-300)',
                }}
              >
                {tRoles(member.role as 'owner' | 'admin' | 'member')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
