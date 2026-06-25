import { getConfig } from '@/lib/config'
import type { ClinicInfo, DoctorInfo } from '@/lib/types'

export default function LocationIntro({ clinic, doctor }: { clinic: ClinicInfo; doctor: DoctorInfo }) {
  const cfg = getConfig()
  const conditions = (cfg.conditions || []).slice(0, 3)
  const procedures = (cfg.procedures || []).slice(0, 3)
  const serviceChips = [
    ...conditions.map((s: any) => s.title || s.label),
    ...procedures.map((p: any) => p.title || p.label),
  ]
  const specialty = clinic.medicalSpecialty || doctor.jobTitle || 'specialist'
  return (
    <section className="intro-section">
      <div className="intro-inner">
        <div className="intro-grid">
          <div className="intro-content">
            <h2>Your trusted {specialty} clinic in {clinic.city}</h2>
            <p>Led by {doctor.name}, a {doctor.experience?.[0]?.role || 'specialist'} with {doctor.stats[0]?.number} years of experience and over {doctor.stats[1]?.number} patients treated. The clinic offers comprehensive services from consultation to treatment and rehabilitation.</p>
            <p>Located at {clinic.street}, {clinic.area} -- one of {clinic.city}&apos;s most accessible and well-connected healthcare hubs.</p>
            <div className="intro-highlights">
              {serviceChips.map((chip, i) => <span key={i} className="intro-chip">{chip}</span>)}
            </div>
          </div>
          <div className="intro-visual">
            <div style={{ width: '100%', height: '220px', background: 'linear-gradient(135deg,var(--primary),var(--secondary-deep))', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🏥</div>
          </div>
        </div>
      </div>
    </section>
  )
}
