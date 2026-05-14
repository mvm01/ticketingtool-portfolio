'use client'

import { useTranslations } from 'next-intl'
import { useAuth } from '@/features/auth/context'

export default function SettingsPage() {
  const tNav = useTranslations('nav')
  const { user } = useAuth()

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">{tNav('settings')}</h1>
      </div>

      <div
        style={{
          background: 'var(--brand-800)',
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          padding: '1.25rem',
          maxWidth: 480,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Row label="Organization" value={user?.organization?.name ?? '—'} />
          <Row label="Email" value={user?.email ?? '—'} />
          <Row label="Role" value={user?.membership?.role ?? '—'} />
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '0.625rem',
        borderTop: '1px solid var(--border)',
        gap: '1rem',
      }}
    >
      <span style={{ fontSize: '0.8125rem', color: 'var(--silver-500)' }}>{label}</span>
      <span style={{ fontSize: '0.8125rem', color: 'var(--silver-200)', fontWeight: 500 }}>
        {value}
      </span>
    </div>
  )
}
