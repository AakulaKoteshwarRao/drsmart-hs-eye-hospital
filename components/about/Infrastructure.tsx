import type { ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

const GRADS = [
  'linear-gradient(145deg,var(--secondary),var(--primary))',
  'linear-gradient(145deg,var(--secondary-deep),var(--secondary))',
  'linear-gradient(145deg,var(--primary),var(--primary-dark))',
  'linear-gradient(145deg,var(--primary-dark),var(--secondary-deep))',
  'linear-gradient(145deg,var(--secondary-dark),var(--primary))',
  'linear-gradient(145deg,var(--secondary),var(--secondary-dark))',
]

export default function Infrastructure({ clinic }: { clinic: ClinicInfo }) {
  const facilities = (clinic as any).facilities || []
  if (facilities.length === 0) return null
  return (
    <section className="infra-section">
      <div className="sec-header">
        <div className="sec-label"><span>Facilities</span></div>
        <h2 className="sec-title">Modern infrastructure for better outcomes.</h2>
        <p className="sec-sub">Our clinic is equipped with advanced diagnostic and treatment technology.</p>
      </div>
      <div className="infra-grid">
        {facilities.map((f: any, i: number) => (
          <div key={i} className="infra-card">
            <div className="infra-card-visual" style={{ background: GRADS[i % GRADS.length] }}>
              <Icon name="pulse" size={32} color="rgba(255,255,255,0.6)" />
            </div>
            <div className="infra-card-body" style={{ padding: '1.25rem' }}>
              <h3>{f.title}</h3>
              {f.description && <p>{f.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
