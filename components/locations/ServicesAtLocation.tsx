import { getConfig } from '@/lib/config'

const colors = ['var(--primary)','var(--secondary)','var(--primary-dark)','var(--secondary-dark)','#D68910','var(--secondary-deep)','#1E8449','var(--secondary)']

export default function ServicesAtLocation() {
  const cfg = getConfig()
  const conditions = cfg.conditions || []
  const procedures = cfg.procedures || []
  const services = [
    ...conditions.map((s: any, i: number) => ({ label: s.title || s.label, color: colors[i % colors.length], slug: s.slug, type: 'conditions' })),
    ...procedures.map((p: any, i: number) => ({ label: p.title || p.label, color: colors[(i + 4) % colors.length], slug: p.slug, type: 'procedures' })),
  ]
  return (
    <section className="services-loc-section">
      <div className="services-loc-inner">
        <div className="sec-header">
          <div className="sec-label"><span>Services Available</span></div>
          <h2 className="sec-title">What we offer at this location.</h2>
        </div>
        <div className="services-loc-grid">
          {services.map((s, i) => (
            <a key={i} href={`/${s.type}/${s.slug}`} className="svc-chip">
              <span className="svc-dot" style={{ background: s.color }}></span>
              <span>{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
