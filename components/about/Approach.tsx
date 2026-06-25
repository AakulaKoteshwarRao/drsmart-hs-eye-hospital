import { Icon } from '@/lib/icons'

const approaches = [
  { grad: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', icon: 'pulse', title: 'Evidence-Based Treatment', desc: 'Every diagnosis and treatment plan is grounded in current clinical evidence and proven medical protocols.' },
  { grad: 'linear-gradient(135deg,var(--secondary),var(--secondary-dark))', icon: 'user', title: 'Patient-First Communication', desc: 'Patients are informed at every step -- from diagnosis to risks to costs. No decisions are made without clear explanation.' },
  { grad: 'linear-gradient(135deg,var(--secondary-deep),var(--secondary-deep))', icon: 'check-circle', title: 'Outcome-Focused Care', desc: 'Success is measured by real recovery -- functional improvement, reduced symptoms, and return to daily life.' },
]

export default function Approach() {
  return (
    <section className="approach-section section-cool-grey">
      <div className="approach-inner">
        <div className="sec-header">
          <div className="sec-label"><span>Our Approach</span></div>
          <h2 className="sec-title">How we practise.</h2>
          <p className="sec-sub">The principles that guide every decision, treatment, and interaction at the clinic.</p>
        </div>
        <div className="approach-grid">
          {approaches.map((a, i) => (
            <div key={i} className="approach-card">
              <div className="approach-icon" style={{ background: a.grad }}>
                <Icon name={a.icon} size={24} color="#FFFFFF" />
              </div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
