import Image from 'next/image'
import type { ServiceItem } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function ProceduresGrid({ procedures }: { procedures: ServiceItem[] }) {
  return (
    <section id="procedures" className="card-section" style={{ background: 'var(--neutral-100)' }}>
      <div className="sec-header">
        <div className="sec-label"><span>Procedures We Do</span></div>
        <h2 className="sec-title">Surgical &amp; non-surgical treatments.</h2>
        <p className="sec-sub">Advanced procedures performed at our hospital by our experienced team.</p>
      </div>
      <div className="card-grid">
        {procedures.map((p, i) => (
          <div key={i} className="service-card">
            <div className="service-card-visual" style={{ background: p.gradient, overflow: 'hidden', position: 'relative' }}>
              {p.image ? (
                <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 400px" style={{ objectFit: 'cover' }} />
              ) : (
                <Icon name={p.iconType as any || 'check-circle'} size={32} color="rgba(255,255,255,0.6)" />
              )}
            </div>
            <div className="service-card-body" style={{ padding: '1.25rem' }}>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <a href={`/procedures/${p.slug}`} className="learn-more">
                Learn More <Icon name="arrow-right" size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
