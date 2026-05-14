import { Skeleton } from '@/components/ui/skeleton'

export function MobileSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        background: 'var(--brand-900)',
        maxWidth: 430,
        margin: '0 auto',
      }}
    >
      {/* Header skeleton */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1.25rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Skeleton className="mobile-skeleton__org" />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Skeleton className="mobile-skeleton__icon-btn" />
          <Skeleton className="mobile-skeleton__avatar" />
        </div>
      </div>

      {/* Content skeleton */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Skeleton className="mobile-skeleton__greeting" />
        <Skeleton className="mobile-skeleton__sub" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Skeleton className="mobile-skeleton__stat" />
          <Skeleton className="mobile-skeleton__stat" />
        </div>

        <Skeleton className="mobile-skeleton__cta" />

        <Skeleton className="mobile-skeleton__section-label" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="mobile-skeleton__row" />
          ))}
        </div>
      </div>

      {/* Bottom tabs skeleton */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 430,
          height: '4rem',
          background: 'var(--brand-800)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 2rem',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="mobile-skeleton__tab" />
        ))}
      </div>
    </div>
  )
}
