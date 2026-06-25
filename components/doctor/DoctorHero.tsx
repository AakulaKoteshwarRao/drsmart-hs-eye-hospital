'use client'
import Image from 'next/image'
import type { DoctorInfo, ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function DoctorHero({ doctor, clinic }: { doctor: DoctorInfo; clinic: ClinicInfo }) {
  return (
    <section className="doc-hero-section">
      <div className="doc-hero-inner">
        <div className="doc-hero-grid">
          <div className="doc-photo-wrap">
            <div className="doc-photo">
              {doctor.photo ? (
                <Image src={doctor.photo} alt={doctor.name} fill sizes="(max-width: 768px) 100vw, 400px" style={{ objectFit: 'cover' }} priority />
              ) : (
                <>
                  <Icon name="user" size={64} color="rgba(255,255,255,0.25)" />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>Doctor Photo</span>
                </>
              )}
            </div>
          </div>
          <div className="doc-info">
            <div className="sec-label"><span style={{ color: 'var(--primary)' }}>Meet the Doctor</span></div>
            <h1 className="doc-name">{doctor.name}</h1>
            <p className="doc-degree">{doctor.qualifications.join(' · ')}</p>
            <div className="doc-specialty-tags">
              {doctor.specialties.map((s, i) => <span key={i} className="doc-spec-tag">{s}</span>)}
            </div>
            <div className="doc-stats-row">
              {doctor.stats.map((stat, i) => (
                <div key={i} className="doc-stat">
                  <span className="doc-stat-num">{stat.number}</span>
                  <span className="doc-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
            <div className="doc-details">
              <div className="doc-detail-item">
                <Icon name="location" size={18} color="var(--primary)" />
                <a href={clinic.mapUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--text-base)' }}>{clinic.address}</a>
              </div>
              <div className="doc-detail-item">
                <Icon name="clock" size={18} color="var(--primary)" />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-base)' }}>{clinic.hours}</span>
              </div>
              <div className="doc-detail-item">
                <Icon name="language" size={18} color="var(--primary)" />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-base)' }}>{doctor.languages.join(' · ')}</span>
              </div>
            </div>
            <a href="/appointment" className="doc-cta-btn" onClick={e => { e.preventDefault(); typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("openAppointmentModal")) }}>
              Book Appointment <Icon name="arrow-right" size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
