'use client'
import type { CTABand } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function CTABand({ cta }: { cta: CTABand }) {
  return (
    <section className="cta-band">
      <div className="cta-band-inner">
        <div className="cta-band-content">
          <h2>{cta.heading}</h2>
          <p>{cta.subtext}</p>
          <div className="cta-band-actions">
            <a href={cta.primaryHref} className="cta-primary" onClick={e => { e.preventDefault(); typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("openAppointmentModal")) }}>
              {cta.primaryLabel} <Icon name="arrow-right" size={16} />
            </a>
            <a href={cta.secondaryHref} target="_blank" rel="noreferrer" className="cta-secondary">
              <Icon name="whatsapp" size={16} /> {cta.secondaryLabel}
            </a>
          </div>
          <div className="cta-band-info">
            {cta.infoItems.map((item, i) => <span key={i}>{item}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}
