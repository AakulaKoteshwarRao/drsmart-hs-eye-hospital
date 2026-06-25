import type { DoctorInfo, ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

const GRADS = [
  'linear-gradient(135deg,var(--primary),var(--primary-dark))',
  'linear-gradient(135deg,var(--secondary),var(--secondary-dark))',
  'linear-gradient(135deg,var(--secondary-deep),var(--secondary-deep))',
  'linear-gradient(135deg,var(--primary-dark),var(--secondary-deep))',
]
const ICONS = ['award', 'star', 'user', 'check-circle']

export default function Achievements({ doctor, clinic }: { doctor: DoctorInfo; clinic: ClinicInfo }) {
  const awards = doctor.awards || []
  if (awards.length === 0) return null
  return (
    <section className="achieve-section">
      <div className="sec-header">
        <div className="sec-label"><span>Achievements</span></div>
        <h2 className="sec-title">Recognised for quality care.</h2>
        <p className="sec-sub">Milestones and recognitions earned through consistent clinical excellence.</p>
      </div>
      <div className="achieve-grid">
        {awards.map((a, i) => (
          <div key={i} className="achieve-card">
            <div className="achieve-icon" style={{ background: GRADS[i % GRADS.length] }}>
              <Icon name={ICONS[i % ICONS.length]} size={24} color="#FFFFFF" />
            </div>
            <div style={{ padding: '0 0.5rem' }}>
              <h3>{a.title}</h3>
              <p>{a.year}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
