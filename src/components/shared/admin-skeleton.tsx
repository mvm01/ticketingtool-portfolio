import { Skeleton } from '@/components/ui/skeleton'

export function AdminSkeleton() {
  return (
    <div className="app-shell">
      {/* Sidebar skeleton */}
      <div className="app-shell__sidebar">
        <div
          style={{
            height: '100vh',
            background: 'var(--brand-800)',
            borderRight: '1px solid var(--border)',
            padding: '1.25rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.75rem' }}>
            <Skeleton className="admin-skeleton__brand-icon" />
            <Skeleton className="admin-skeleton__brand-text" />
          </div>
          <Skeleton className="admin-skeleton__org" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginTop: '0.5rem' }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="admin-skeleton__nav-item" />
            ))}
          </div>
        </div>
      </div>

      {/* Main area skeleton */}
      <div className="app-shell__main">
        {/* Topbar skeleton */}
        <div
          style={{
            height: '3.25rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 1.25rem',
            gap: '0.75rem',
          }}
        >
          <Skeleton className="admin-skeleton__topbar-btn" />
          <Skeleton className="admin-skeleton__avatar" />
        </div>

        {/* Content skeleton */}
        <div className="app-shell__content">
          <Skeleton className="admin-skeleton__page-title" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}
          >
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="admin-skeleton__stat" />
            ))}
          </div>
          <Skeleton className="admin-skeleton__section-label" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="admin-skeleton__card" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
