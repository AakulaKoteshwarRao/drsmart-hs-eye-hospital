import type { ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function PageDisabled({ title, clinic }: { title: string; clinic: ClinicInfo }) {
  return (
    <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg,var(--secondary),var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Icon name="info" size={28} color="#FFFFFF" />
        </div>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{title} -- Coming Soon</h1>
        <p style={{ color: 'var(--text-faint)', lineHeight: 1.6, marginBottom: '2rem' }}>This page is not yet enabled. To activate it, set <code style={{ background: 'var(--neutral-100)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: 'var(--text-sm)' }}>optionalPages.{title.toLowerCase()}</code> to <code style={{ background: 'var(--neutral-100)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: 'var(--text-sm)' }}>true</code> in your config.</p>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg,var(--secondary),var(--primary))', color: '#fff', fontWeight: 700, padding: '0.8rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontSize: 'var(--text-base)' }}>
          Back to Home <Icon name="arrow-right" size={16} color="#FFFFFF" />
        </a>
      </div>
    </main>
  )
}
