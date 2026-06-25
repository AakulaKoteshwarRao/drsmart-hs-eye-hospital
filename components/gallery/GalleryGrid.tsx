'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Icon } from '@/lib/icons'

function buildItems(photos: Record<string, string>) {
  const p = (key: string) => photos[key] || ''
  return [
    { cat: 'clinic',      tag: 'Clinic',         grad: 'linear-gradient(145deg,var(--secondary),var(--secondary))',             title: 'Clinic -- Reception Area',           src: p('clinic_1') },
    { cat: 'clinic',      tag: 'Clinic',         grad: 'linear-gradient(145deg,var(--secondary-deep),var(--secondary))',        title: 'Consultation Room',                  src: p('clinic_2') },
    { cat: 'clinic',      tag: 'Clinic',         grad: 'linear-gradient(145deg,var(--secondary),var(--secondary-dark))',        title: 'Clinic Interior',                    src: p('clinic_3') },
    { cat: 'equipment',   tag: 'Equipment',      grad: 'linear-gradient(145deg,var(--primary),var(--primary-dark))',            title: 'Diagnostic Equipment',               src: p('equipment_1') },
    { cat: 'equipment',   tag: 'Equipment',      grad: 'linear-gradient(145deg,var(--secondary),var(--primary))',               title: 'Examination Unit',                   src: p('equipment_2') },
    { cat: 'equipment',   tag: 'Equipment',      grad: 'linear-gradient(145deg,var(--secondary-deep),var(--primary))',          title: 'Advanced Scanning Equipment',        src: p('equipment_3') },
    { cat: 'doctor',      tag: 'Doctor',         grad: 'linear-gradient(145deg,var(--secondary),var(--primary))',               title: 'Doctor -- Consultation',             src: p('doctor_1') },
    { cat: 'doctor',      tag: 'Doctor',         grad: 'linear-gradient(145deg,var(--secondary),var(--secondary-dark))',        title: 'Doctor -- Procedure Prep',           src: p('doctor_2') },
    { cat: 'awards',      tag: 'Awards',         grad: 'linear-gradient(145deg,var(--primary-dark),var(--secondary-deep))',     title: 'Healthcare Excellence Recognition',  src: p('awards_1') },
    { cat: 'awards',      tag: 'Awards',         grad: 'linear-gradient(145deg,var(--secondary-deep),var(--primary-dark))',     title: 'Award Recognition',                  src: p('awards_2') },
    { cat: 'conferences', tag: 'Conferences',    grad: 'linear-gradient(145deg,var(--secondary-deep),var(--secondary-dark))',   title: 'National Medical Conference',        src: p('conference_1') },
    { cat: 'conferences', tag: 'Conferences',    grad: 'linear-gradient(145deg,var(--secondary-deep),var(--secondary-dark))',   title: 'Annual Conference -- Presentation',  src: p('conference_2') },
    { cat: 'results',     tag: 'Before & After', grad: 'linear-gradient(145deg,var(--primary),var(--primary-dark))',            title: 'Treatment Outcome -- Case Study',    src: p('result_1') },
    { cat: 'results',     tag: 'Before & After', grad: 'linear-gradient(145deg,var(--secondary-deep),var(--primary))',          title: 'Patient Recovery -- Post Treatment', src: p('result_2') },
  ]
}

const tabs = [
  { label: 'All', cat: 'all' },
  { label: 'Clinic', cat: 'clinic' },
  { label: 'Equipment', cat: 'equipment' },
  { label: 'Doctor', cat: 'doctor' },
  { label: 'Awards', cat: 'awards' },
  { label: 'Conferences', cat: 'conferences' },
  { label: 'Before & After', cat: 'results' },
]

export default function GalleryGrid({ photos = {} }: { photos?: Record<string, string> }) {
  const items = buildItems(photos)
  const [active, setActive] = useState('all')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const filtered = active === 'all' ? items : items.filter(i => i.cat === active)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox === null) return
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => i !== null ? (i + 1) % filtered.length : null)
      if (e.key === 'ArrowLeft') setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, filtered.length])

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  const current = lightbox !== null ? filtered[lightbox] : null

  return (
    <section className="gallery-section">
      <div className="gallery-inner">
        <div className="filter-bar">
          {tabs.map(t => (
            <button key={t.cat} className={`filter-tab${active === t.cat ? ' active' : ''}`} onClick={() => { setActive(t.cat); setLightbox(null) }}>{t.label}</button>
          ))}
        </div>
        <div className="photo-grid">
          {filtered.map((item, i) => (
            <div key={i} className="gallery-item" onClick={() => setLightbox(i)}>
              <div className="gallery-thumb" style={{ background: item.grad }}>
                {item.src ? (
                  <Image src={item.src} alt={item.title} fill sizes="(max-width: 768px) 50vw, 300px" style={{ objectFit: 'cover' }} loading="lazy" />
                ) : (
                  <Icon name={item.cat === 'doctor' ? 'user' : 'file'} size={32} color="rgba(255,255,255,0.4)" />
                )}
              </div>
              <div className="gallery-overlay">
                <span className="gallery-overlay-tag">{item.tag}</span>
                <span className="gallery-overlay-title">{item.title}</span>
              </div>
              <div className="gallery-expand"><Icon name="external-link" size={16} color="#FFFFFF" /></div>
            </div>
          ))}
        </div>
      </div>
      {lightbox !== null && current && (
        <div className="lightbox open" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <span className="lightbox-counter">{lightbox + 1} / {filtered.length}</span>
            <button className="lightbox-close" onClick={() => setLightbox(null)}><Icon name="close" size={20} /></button>
            <button className="lightbox-nav lightbox-prev" onClick={() => setLightbox((lightbox - 1 + filtered.length) % filtered.length)}><Icon name="arrow-left" size={20} /></button>
            <button className="lightbox-nav lightbox-next" onClick={() => setLightbox((lightbox + 1) % filtered.length)}><Icon name="arrow-right" size={20} /></button>
            <div className="lightbox-img" style={{ background: current.grad }}>
              {current.src ? (
                <Image src={current.src} alt={current.title} fill sizes="90vw" style={{ objectFit: 'contain' }} />
              ) : (
                <Icon name={current.cat === 'doctor' ? 'user' : 'file'} size={48} color="rgba(255,255,255,0.4)" />
              )}
            </div>
            <div className="lightbox-caption"><h3>{current.title}</h3><span>{current.tag}</span></div>
          </div>
        </div>
      )}
    </section>
  )
}
