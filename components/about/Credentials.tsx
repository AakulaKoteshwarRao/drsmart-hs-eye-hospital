import { STAT_COLOURS } from '@/lib/pills'
import type { DoctorInfo, ClinicInfo } from '@/lib/types'

export default function Credentials({ doctor, clinic }: { doctor: DoctorInfo; clinic: ClinicInfo }) {
  const subLabels = [`Years in practice`, `Across ${clinic.city} & region`, `Surgical & non-surgical`, `Verified reviews`]
  return (
    <section className="creds-section section-teal-tint">
      <div className="creds-inner">
        <div className="sec-header">
          <div className="sec-label"><span>Credentials</span></div>
          <h2 className="sec-title">Numbers that reflect trust.</h2>
          <p className="sec-sub">Built over years of consistent, patient-first clinical practice.</p>
        </div>
        <div className="creds-grid">
          {doctor.stats.map((stat, i) => (
            <div key={i} className="cred-card">
              <div className="cred-number" style={{ background: "none", WebkitTextFillColor: STAT_COLOURS[i % STAT_COLOURS.length], color: STAT_COLOURS[i % STAT_COLOURS.length] }}>{stat.number}</div>
              <div className="cred-label">{stat.label}</div>
              <div className="cred-sub">{subLabels[i] ?? ''}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
