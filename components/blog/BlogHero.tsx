import { getConfig } from '@/lib/config'

export default function BlogHero() {
  const cfg = getConfig()
  const specialty = cfg.clinic?.medicalSpecialty || cfg.doctor?.jobTitle || 'health'
  const clinicName = cfg.clinic?.name || 'Our Clinic'
  const doctorName = cfg.doctor?.name || 'our specialist'
  return (
    <section className="blog-hero">
      <div className="sec-label"><span>{clinicName} Resources</span></div>
      <h1>Expert insights on <em>{specialty.toLowerCase()}.</em></h1>
      <p className="blog-hero-text">
        Articles, guides, and patient resources written by {doctorName} -- covering {specialty.toLowerCase()}, treatment options, and everything in between.
      </p>
    </section>
  )
}
