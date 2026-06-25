'use client'
import Image from 'next/image'
import type { DoctorInfo, ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'
import { STAT_COLOURS_DARK, PILL_STYLES_DARK } from '@/lib/pills'

export default function MeetDoctor({ doctor, clinic }: { doctor: DoctorInfo; clinic: ClinicInfo }) {
  return (
    <section className="doc-hero-section">
      <div className="doc-hero-inner">
        <div className="doc-hero-grid">
          <div className="doc-photo-wrap">
            <div className="doc-photo">
              {doctor.photo ? (
                <Image src={doctor.photo} alt={doctor.name} fill sizes="(max-width: 768px) 100vw, 400px" style={{ objectFit: 'cover' }} priority={false} />
              ) : (
                <>
                  <Icon name="user" size={64} color="rgba(255,255,255,0.25)" />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>Doctor Photo</span>
                </>
              )}
            </div>
          </div>
          <div className="doc-info">
            <div className="sec-label">
              <span style={{ color: 'var(--primary)' }}>Meet the Doctor</span>
            </div>
            <h2 className="doc-name">{doctor.name}</h2>
            <p className="doc-degree">{doctor.degrees}</p>
            <div className="doc-specialty-tags">
              {doctor.specialties.map((s, i) => (
                <span key={i} className="doc-spec-tag" style={{ background: PILL_STYLES_DARK[i % PILL_STYLES_DARK.length].background, borderColor: PILL_STYLES_DARK[i % PILL_STYLES_DARK.length].border, color: PILL_STYLES_DARK[i % PILL_STYLES_DARK.length].color }}>{s}</span>
              ))}
            </div>
            <div className="doc-stats-row">
              {doctor.stats.map((stat, i) => (
                <div key={i} className="doc-stat">
                  <span className="doc-stat-num" style={{ color: STAT_COLOURS_DARK[i % STAT_COLOURS_DARK.length] }}>{stat.number}</span>
                  <span className="doc-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
            <div className="doc-details">
              {doctor.details.map((detail, i) => (
                <div key={i} className="doc-detail-item">
                  <Icon name={detail.icon} size={18} color="var(--primary)" />
                  {detail.link ? (
                    <a href={detail.link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--text-base)' }}>
                      {detail.text}
                    </a>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-base)' }}>{detail.text}</span>
                  )}
                </div>
              ))}
            </div>
            <a href="/appointment" className="doc-cta-btn" onClick={e => { e.preventDefault(); typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("openAppointmentModal")) }}>
              {doctor.ctaLabel} <Icon name="arrow-right" size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
