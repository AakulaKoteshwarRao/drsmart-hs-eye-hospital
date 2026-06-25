import { getConfig } from '@/lib/config'

export default function GalleryHero() {
  const cfg = getConfig()
  const clinicName = cfg.clinic?.name || 'Our Clinic'
  return (
    <section className="gallery-hero">
      <div className="sec-label"><span>Photo Gallery</span></div>
      <h1>Inside <em>{clinicName}.</em></h1>
      <p className="gallery-hero-text">
        A glimpse into our clinic, equipment, team, and patient milestones -- so you know exactly what to expect when you visit us.
      </p>
    </section>
  )
}
