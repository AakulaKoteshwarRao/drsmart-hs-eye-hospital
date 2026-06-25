import type { ClinicInfo } from '@/lib/types'

const BG_COLORS = [
  '#C0392B', '#004B87', '#B22222', '#006400',
  '#003399', '#E60012', '#1A5276', 'var(--secondary)',
]

function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 3)
}

export default function Insurance({ clinic }: { clinic: ClinicInfo }) {
  const insurers = (clinic as any).insurers || []
  if (insurers.length === 0) return null
  const items = insurers.map((ins: any, i: number) => ({
    bg: BG_COLORS[i % BG_COLORS.length],
    initials: getInitials(ins.name),
    name: ins.name,
  }))
  return (
    <section className="insurance-section">
      <div className="sec-header">
        <div className="sec-label"><span>Insurance</span></div>
        <h2 className="sec-title">Insurance partners.</h2>
        <p className="sec-sub">We work with all major insurance providers. Cashless facility is available.</p>
      </div>
      <div className="ins-grid">
        {items.map((ins: any, i: number) => (
          <div key={i} className="ins-card" style={{ padding: "1rem" }}>
            <div className="ins-logo-box" style={{ background: ins.bg }}>
              <span className="ins-logo-text">{ins.initials}</span>
            </div>
            <span className="ins-name">{ins.name}</span>
          </div>
        ))}
      </div>
      <p className="insurance-note">All major TPA networks accepted. Pre-authorisation assistance and claim follow-up support provided.</p>
    </section>
  )
}
