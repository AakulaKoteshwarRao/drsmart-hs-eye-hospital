'use client'
import Image from 'next/image'
import type { HeroSection, ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'
import { STAT_COLOURS } from '@/lib/pills'

export default function Hero({ hero, clinic }: { hero: HeroSection; clinic: ClinicInfo }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="sec-label"><span>{hero.label}</span></div>
        <h1>{hero.heading} <em>{hero.headingEm}</em></h1>
        <p className="hero-sub">{hero.subtext}</p>
        <div className="hero-tags">
          {hero.tags.map((tag, i) => (
            <span key={i} className="hero-tag">{tag}</span>
          ))}
        </div>
        <a href={hero.ctaHref} className="hero-cta" onClick={e => { e.preventDefault(); typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("openAppointmentModal")) }}>
          {hero.ctaLabel} <Icon name="arrow-right" size={18} />
        </a>
        <div className="hero-stats">
          {hero.stats.map((stat, i) => (
            <div className="stat" key={i}>
              <span className="stat-number" style={{ color: STAT_COLOURS[i % STAT_COLOURS.length] }}>{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="hero-image">
        <div className="doctor-photo-wrapper">
          {clinic.heroImage ? (
            <Image src={clinic.heroImage} alt={clinic.name} width={800} height={600} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} priority sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="doctor-photo-placeholder">
              <Icon name="user" size={56} color="rgba(255,255,255,0.3)" />
              Doctor Photo
            </div>
          )}
          <div className="floating-chip chip-rating">
            <Icon name="star" size={20} />
            {hero.chips.find(c => c.type === 'rating')?.text}
          </div>
          <div className="floating-chip chip-experience">
            <Icon name="clock" size={20} />
            {hero.chips.find(c => c.type === 'experience')?.text}
          </div>
          <div className="floating-chip chip-patients">
            <Icon name="user" size={20} />
            {hero.chips.find(c => c.type === 'patients')?.text}
          </div>
        </div>
      </div>
    </section>
  )
}
