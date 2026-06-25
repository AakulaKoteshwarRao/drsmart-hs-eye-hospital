import type { ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function ClinicDetails({ clinic }: { clinic: ClinicInfo }) {
  const cards = [
    { grad: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', icon: 'location', title: 'Address', body: clinic.address, link: { label: 'Get Directions', href: clinic.mapsUrl } },
    { grad: 'linear-gradient(135deg,var(--secondary),var(--secondary-dark))', icon: 'clock', title: 'Working Hours', body: clinic.hours },
    { grad: 'linear-gradient(135deg,var(--secondary-deep),var(--secondary-deep))', icon: 'buildings', title: 'Parking', body: 'Bike and car parking available on Street No. 1 outside the building.' },
    { grad: 'linear-gradient(135deg,var(--primary-dark),var(--secondary-deep))', icon: 'calendar', title: 'Appointments', body: 'By appointment preferred. Walk-ins accepted subject to availability. Emergency cases seen immediately.' },
  ]
  return (
    <section className="clinic-section">
      <div className="sec-header">
        <div className="sec-label"><span>Clinic Details</span></div>
        <h2 className="sec-title">Everything you need to know.</h2>
      </div>
      <div className="clinic-grid">
        {cards.map((c, i) => (
          <div key={i} className="clinic-card" style={{ padding: '1.5rem' }}>
            <div className="clinic-card-icon" style={{ background: c.grad }}>
              <Icon name={c.icon} size={22} color="#FFFFFF" />
            </div>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
            {c.link && <a href={c.link.href} target="_blank" rel="noopener">{c.link.label} &rarr;</a>}
          </div>
        ))}
      </div>
    </section>
  )
}
