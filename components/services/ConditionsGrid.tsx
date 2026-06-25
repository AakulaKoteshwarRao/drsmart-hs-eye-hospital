import type { ServiceItem } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function ConditionsGrid({ conditions }: { conditions: ServiceItem[] }) {
  return (
    <section id="conditions" className="card-section" style={{ background: 'var(--primary-light)' }}>
      <div className="sec-header">
        <div className="sec-label"><span>Conditions We Treat</span></div>
        <h2 className="sec-title">What brings patients to us.</h2>
        <p className="sec-sub">Conditions we diagnose and treat every day.</p>
      </div>
      <div className="card-grid">
        {conditions.map((c, i) => (
          <div key={i} className="service-card">
            <div className="service-card-visual" style={{ background: c.gradient, overflow: 'hidden' }}>
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <Icon name={c.iconType as any || 'pulse'} size={32} color="rgba(255,255,255,0.6)" />
              )}
            </div>
            <div className="service-card-body" style={{ padding: '1.25rem' }}>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <a href={`/conditions/${c.slug}`} className="learn-more">
                Learn More <Icon name="arrow-right" size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
