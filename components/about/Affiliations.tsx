import type { DoctorInfo, ClinicInfo } from '@/lib/types'

const BG_COLORS = [
  'var(--secondary-deep)', '#1E8449', '#D68910', 'var(--secondary)',
  'var(--primary)', '#C0392B', '#1A5276', '#6C3483',
]

function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 3)
}

export default function Affiliations({ doctor, clinic }: { doctor: DoctorInfo; clinic: ClinicInfo }) {
  const memberships = doctor.memberships || []
  if (memberships.length === 0) return null
  const items = [
    { bg: 'var(--secondary-deep)', initials: getInitials(clinic.name), name: clinic.name, type: 'Primary Practice' },
    ...memberships.map((m, i) => ({ bg: BG_COLORS[(i + 1) % BG_COLORS.length], initials: getInitials(m), name: m, type: 'Professional Body' })),
  ]
  return (
    <section className="affil-section section-cool-grey">
      <div className="affil-inner">
        <div className="sec-header">
          <div className="sec-label"><span>Affiliations</span></div>
          <h2 className="sec-title">Associated institutions.</h2>
          <p className="sec-sub">Hospital ties and institutional associations that support our clinical practice.</p>
        </div>
        <div className="affil-grid">
          {items.map((a, i) => (
            <div key={i} className="affil-card">
              <div className="affil-logo-box" style={{ background: a.bg }}>
                <span className="affil-logo-text">{a.initials}</span>
              </div>
              <div style={{ padding: "0 0.5rem" }}>
                <h4>{a.name}</h4>
                <span className="affil-type">{a.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
