import { Icon } from '@/lib/icons'
import type { ClinicConfig } from '@/lib/types'

interface Props {
  config: ClinicConfig
}

export default function HowToReach({ config }: Props) {
  const cards = [
    { grad: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', icon: 'location', title: 'Nearby Landmarks', body: config?.clinic?.address || 'Contact us for our address.' },
    { grad: 'linear-gradient(135deg,var(--secondary),var(--secondary-dark))', icon: 'map', title: 'By Public Transport', body: 'Local buses, metro, and cabs are available nearby. Contact us for the most convenient route from your location.' },
    { grad: 'linear-gradient(135deg,var(--secondary-deep),var(--secondary-deep))', icon: 'globe', title: 'By Car', body: 'Parking is available near the clinic. Contact us for landmark directions.' },
  ]
  return (
    <section className="reach-section">
      <div className="sec-header">
        <div className="sec-label"><span>Directions</span></div>
        <h2 className="sec-title">How to reach us.</h2>
        <p className="sec-sub">Multiple ways to get to our clinic.</p>
      </div>
      <div className="reach-grid">
        {cards.map((c, i) => (
          <div key={i} className="reach-card" style={{ padding: '1.5rem' }}>
            <div className="reach-card-icon" style={{ background: c.grad }}>
              <Icon name={c.icon} size={22} color="#FFFFFF" />
            </div>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
