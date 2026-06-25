'use client'
import { useState } from 'react'
import { Icon } from '@/lib/icons'

const serviceGrads = [
  'linear-gradient(135deg,var(--primary),var(--primary-dark))',
  'linear-gradient(135deg,var(--secondary),var(--secondary-dark))',
  'linear-gradient(135deg,var(--secondary-dark),var(--secondary-deep))',
]

export default function LocationSpoke(props?: any) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const clinic      = props?.clinic || {}
  const doctor      = props?.doctor || {}
  const area        = props?.area   || {}

  const clinicAddress = clinic.address || ''
  const clinicHours   = clinic.hours   || ''
  const clinicCity    = clinic.city    || ''
  const doctorName    = doctor.name    || 'Your Doctor'
  const doctorDegrees = Array.isArray(doctor.degrees) ? doctor.degrees.join(', ') : (doctor.degrees || '')
  const specialty     = clinic.medicalSpecialty || doctor.specialty || 'Specialist'
  const areaName      = area.name || ''

  const conditionsList = props?.conditions || []
  const services = conditionsList.slice(0, 3).map((s: any, i: number) => ({
    grad: serviceGrads[i % serviceGrads.length],
    title: s.title,
    desc: s.descriptionShort || s.description || `Expert diagnosis and treatment of ${s.title.toLowerCase()} with advanced techniques.`,
    href: `/conditions/${s.slug}`,
  }))

  const allAreas = props?.areas || []
  const nearbyAreas = allAreas.filter((a: any) => a.slug !== area.slug).slice(0, 5).map((a: any) => ({
    label: a.name, href: `/specialist-near-${a.slug}`
  }))

  const intLinks = [
    { label: '← All Areas', href: '/locations' },
    { label: 'Doctor Profile', href: '/doctor' },
    { label: 'All Services', href: '/services' },
    ...conditionsList.slice(0, 3).map((s: any) => ({ label: s.title, href: `/conditions/${s.slug}` })),
    { label: 'Packages', href: '/products' },
    { label: 'Book Appointment', href: '/appointment' },
    { label: 'Blog', href: '/blog' },
  ]

  const qfCards = [
    { grad: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', icon: 'location', label: 'Location', val: clinic.area || clinicCity },
    { grad: 'linear-gradient(135deg,var(--secondary),var(--secondary-dark))', icon: 'clock', label: 'Travel Time', val: area.duration || '10-15 min' },
    { grad: 'linear-gradient(135deg,var(--secondary-dark),var(--secondary-deep))', icon: 'map', label: 'Distance', val: area.distance || '3-5 km' },
    { grad: 'linear-gradient(135deg,var(--primary-dark),var(--secondary-deep))', icon: 'buildings', label: 'Parking', val: 'Available' },
  ]

  const reasons = [
    { grad: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', icon: 'location', text: `Located at ${clinicAddress} — easily accessible from ${areaName}` },
    { grad: 'linear-gradient(135deg,var(--secondary),var(--secondary-dark))', icon: 'clock', text: `Clinic hours ${clinicHours} — convenient for patients in the area` },
    { grad: 'linear-gradient(135deg,var(--secondary-dark),var(--secondary-deep))', icon: 'check', text: `${doctorName} has extensive experience in ${specialty} and complex case management` },
    { grad: 'linear-gradient(135deg,var(--primary-dark),var(--secondary-deep))', icon: 'shield', text: 'Modern diagnostic equipment — all under one roof' },
    { grad: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', icon: 'user', text: `Hundreds of successful outcomes for patients from ${areaName} and surrounding neighbourhoods` },
  ]

  const faqs = [
    { q: 'How do I reach the clinic?', a: `${clinicAddress} — easily accessible from most parts of the area.` },
    { q: 'What are the clinic hours?', a: `${doctorName} consults ${clinicHours}. Please call ahead to confirm your slot.` },
    { q: 'Is parking available at the clinic?', a: 'Yes, parking is available near the clinic. Public transport options are also within walking distance.' },
    { q: 'What conditions are treated at this location?', a: `All major conditions are treated — ${conditionsList.slice(0, 4).map((c: any) => c.title).join(', ')}${conditionsList.length > 4 ? ', and more' : ''}. Full diagnostic workups are available on-site.` },
    { q: 'Can I book an appointment online?', a: 'Yes. You can book via our appointment page or WhatsApp us directly. Same-week appointments are typically available for new patients.' },
  ]

  return (
    <>
      <nav className="breadcrumb">
        <a href="/">Home</a>
        <Icon name="chevron-right" size={12} />
        <a href="/locations">All Areas</a>
        <Icon name="chevron-right" size={12} />
        <span>{areaName}</span>
      </nav>

      <section className="spoke-hero">
        <div className="sec-label"><span>Location</span></div>
        <h1>{specialty} Near <em>{areaName}</em></h1>
        <p className="spoke-hero-desc">Looking for a trusted {specialty.toLowerCase()} near {areaName}? {doctorName} consults at {clinicAddress} — easily reachable from the surrounding area.</p>
        <a href="/appointment" className="spoke-hero-cta" onClick={e => { e.preventDefault(); typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("openAppointmentModal")) }}>
          Book Appointment <Icon name="arrow-right" size={16} />
        </a>
        <div className="qf-grid">
          {qfCards.map((c, i) => (
            <div key={i} className="qf-card">
              <div className="qf-icon" style={{ background: c.grad }}>
                <Icon name={c.icon} size={20} color="#FFFFFF" />
              </div>
              <div className="qf-text">
                <span className="qf-label">{c.label}</span>
                <span className="qf-val">{c.val}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {services.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Services</span></div>
              <h2 className="sec-title">Services for {areaName} patients.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>The most relevant services for patients from this area.</p>
            </div>
            <div className="spoke-services">
              {services.map((s: any, i: number) => (
                <a key={i} href={s.href} className="spoke-svc-card">
                  <div className="spoke-svc-icon" style={{ background: s.grad }}>
                    <Icon name="clock" size={22} color="#FFFFFF" />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <span className="spoke-svc-link">Learn more <Icon name="arrow-right" size={14} /></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="sec-teal">
        <div className="sec-pad">
          <div className="sec-header" style={{ textAlign: 'center' }}>
            <div className="sec-label" style={{ justifyContent: 'center' }}><span>Why Us</span></div>
            <h2 className="sec-title">Why patients from {areaName} choose us.</h2>
          </div>
          <div className="reasons-list">
            {reasons.map((r, i) => (
              <div key={i} className="reason-row">
                <div className="reason-icon" style={{ background: r.grad }}>
                  <Icon name={r.icon} size={20} color="#FFFFFF" />
                </div>
                <span>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sec-white">
        <div className="sec-pad">
          <div className="sec-header" style={{ textAlign: 'center' }}>
            <div className="sec-label" style={{ justifyContent: 'center' }}><span>Your Doctor</span></div>
            <h2 className="sec-title">Meet your specialist.</h2>
          </div>
          <div className="doc-mini">
            <div className="doc-mini-photo">
              {doctor.photo ? (
                <img src={doctor.photo} alt={doctorName} width={80} height={80} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <Icon name="user" size={32} color="rgba(255,255,255,0.3)" />
              )}
            </div>
            <div className="doc-mini-info">
              <h3>{doctorName}</h3>
              <div className="doc-spec">{doctorDegrees}</div>
              <p>{doctorName} brings extensive expertise in {specialty}, consulting at {clinicAddress} — {clinicHours}.</p>
              <a href="/doctor" className="doc-mini-link">View full profile <Icon name="arrow-right" size={14} /></a>
            </div>
          </div>
        </div>
      </div>

      {nearbyAreas.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Nearby</span></div>
              <h2 className="sec-title">Also serving nearby areas.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>We see patients from across {clinicCity}. Here are some nearby areas we serve.</p>
            </div>
            <div className="nearby-pills">
              {nearbyAreas.map((a: any, i: number) => (
                <a key={i} href={a.href} className="nearby-pill">
                  <Icon name="location" size={14} /> {a.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="sec-white">
        <div className="sec-pad">
          <div className="sec-header" style={{ textAlign: 'center' }}>
            <div className="sec-label" style={{ justifyContent: 'center' }}><span>FAQ</span></div>
            <h2 className="sec-title">Questions from {areaName} patients.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="faq-q">
                  <span>{f.q}</span>
                  <div className="faq-toggle">
                    <Icon name="check" size={16} />
                  </div>
                </div>
                {openFaq === i && (
                  <div className="faq-a" style={{ padding: '0 1.5rem 1.5rem' }}>
                    <p>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sec-teal">
        <div className="sec-pad">
          <div className="sec-header" style={{ textAlign: 'center' }}>
            <div className="sec-label" style={{ justifyContent: 'center' }}><span>Explore</span></div>
            <h2 className="sec-title">Learn more about our services.</h2>
          </div>
          <div className="int-links">
            {intLinks.map((l, i) => (
              <a key={i} href={l.href} className="int-link">{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
