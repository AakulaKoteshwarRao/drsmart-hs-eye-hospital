import { Icon } from '@/lib/icons'

const trustItems = [
  { grad: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', icon: 'shield', label: 'Every journey starts with a conversation' },
  { grad: 'linear-gradient(135deg,var(--secondary),var(--secondary-dark))', icon: 'check-circle', label: 'No obligation to proceed' },
  { grad: 'linear-gradient(135deg,var(--secondary-deep),var(--secondary-deep))', icon: 'shield', label: 'Your details are private' },
]

export default function AppointmentHero() {
  return (
    <section className="appt-hero">
      <div className="sec-label"><span>Book Appointment</span></div>
      <h1>Take the first step towards <em>better health.</em></h1>
      <p className="appt-hero-text">Fill out the form below and our team will reach out to confirm your appointment. Every consultation is thorough, unhurried, and focused on finding the right solution for you.</p>
      <div className="appt-hero-trust">
        {trustItems.map((t, i) => (
          <div key={i} className="trust-item">
            <div className="trust-icon" style={{ background: t.grad }}>
              <Icon name={t.icon} size={20} color="#FFFFFF" />
            </div>
            <span>{t.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
