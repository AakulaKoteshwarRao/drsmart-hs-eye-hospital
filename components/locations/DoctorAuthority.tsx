import type { DoctorInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function DoctorAuthority({ doctor }: { doctor: DoctorInfo }) {
  const specialties = doctor.specialties || []
  const specialtyText = specialties.length > 0 ? specialties.slice(0, 3).join(', ') : doctor.jobTitle || ''
  return (
    <section className="doc-authority">
      <div className="doc-authority-inner">
        <div className="doc-auth-avatar">
          <Icon name="user" size={32} color="rgba(255,255,255,0.4)" />
        </div>
        <div className="doc-auth-text">
          <h3>{doctor.name}</h3>
          <p>{doctor.name} -- {doctor.degrees}. {doctor.stats[0]?.number} years of experience specialising in {specialtyText}.</p>
          <a href="/doctor" className="doc-auth-link">
            View Full Profile <Icon name="arrow-right" size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
