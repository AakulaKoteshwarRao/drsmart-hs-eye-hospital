'use client'
import { useRef } from 'react'
import type { TeamMember } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function TeamCarousel({ members, showLead = false }: { members: TeamMember[]; showLead?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = showLead ? members : members.filter(m => !m.isLead)
  const scroll = (dir: number) => { ref.current?.scrollBy({ left: dir * 340, behavior: 'smooth' }) }

  return (
    <section className="team-grid-section">
      <div className="team-grid-inner">
        <div className="team-carousel-wrap">
          <button className="carousel-btn carousel-prev" aria-label="Previous" onClick={() => scroll(-1)}>
            <Icon name="arrow-left" size={20} color="#FFFFFF" />
          </button>
          <div className="team-carousel" ref={ref}>
            {visible.map((m, i) => (
              <div key={i} className="team-card">
                <div className="team-card-photo" style={{ background: m.gradient, position: 'relative', overflow: 'hidden' }}>
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} width={400} height={400} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  ) : (
                    <><Icon name="user" size={48} color="rgba(255,255,255,0.3)" /><span>Photo</span></>
                  )}
                </div>
                <div className="team-card-body" style={{ padding: '1.5rem' }}>
                  <h3 className="team-card-name">{m.name}</h3>
                  <p className="team-card-desg">{m.designation}</p>
                  <div className="team-card-quals">
                    {m.qualifications.map((q, j) => <span key={j} className="team-qual">{q}</span>)}
                  </div>
                  <div className="team-card-meta">
                    <div className="team-meta-item"><Icon name="clock" size={16} /><span>{m.experience} years experience</span></div>
                    <div className="team-meta-item"><Icon name="calendar" size={16} /><span>{m.schedule}</span></div>
                  </div>
                  <a href="/appointment" className="team-card-cta" onClick={e => { e.preventDefault(); typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("openAppointmentModal")) }}>
                    Book Appointment <Icon name="arrow-right" size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-btn carousel-next" aria-label="Next" onClick={() => scroll(1)}>
            <Icon name="arrow-right" size={20} color="#FFFFFF" />
          </button>
        </div>
      </div>
    </section>
  )
}
