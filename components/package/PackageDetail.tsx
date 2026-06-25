'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Icon } from '@/lib/icons'
import { PILL_STYLES as pillStyles, STAT_COLOURS } from '@/lib/pills'


const iconGrads = [
  'linear-gradient(135deg,var(--primary),var(--primary-dark))',
  'linear-gradient(135deg,var(--secondary),var(--secondary-dark))',
  'linear-gradient(135deg,var(--secondary-deep),var(--secondary-deep))',
  'linear-gradient(135deg,#D68910,#B7770A)',
]
const sfClasses = ['sf-1','sf-2','sf-3','sf-4']
const stepIconNames = ['message', 'search', 'file', 'check-circle']
const inclIconNames = ['message', 'search', 'file', 'check-circle']
const payIconNames  = ['credit-card', 'shield', 'dollar', 'user']

export interface PackageDetailProps {
  name: string
  slug?: string
  description?: string
  pills?: string[]
  heroImage?: string | null
  priceRange?: string
  priceUnit?: string
  inclusions?: { category: string; items: string[] }[]
  howItWorks?: { title: string; description: string }[]
  whoIsItFor?: string[]
  pricingTitle?: string
  pricingSubtitle?: string
  pricingRows?: { label: string; value: string }[]
  pricingTotal?: { label: string; value: string }
  pricingNote?: string
  paymentOptions?: { title: string; items: string[] }[]
  testimonials?: { name: string; detail: string; text: string; rating?: number }[]
  relatedProcedures?: { name: string; slug: string }[]
  faqs?: { question: string; answer: string }[]
  clinicName?: string
  clinicAddress?: string
  clinicHours?: string
  whatsappNumber?: string
  appointmentUrl?: string
}

export default function PackageDetail({
  name = 'Package',
  description = '',
  pills = [],
  heroImage,
  priceRange,
  priceUnit,
  inclusions = [],
  howItWorks = [],
  whoIsItFor = [],
  pricingTitle,
  pricingSubtitle,
  pricingRows = [],
  pricingTotal,
  pricingNote,
  paymentOptions = [],
  testimonials = [],
  relatedProcedures = [],
  faqs = [],
  clinicName = '',
  clinicAddress = '',
  clinicHours = '',
  whatsappNumber = '',
  appointmentUrl = '/appointment',
}: PackageDetailProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <nav className="breadcrumb">
        <a href="/">Home</a>
        <Icon name="chevron-right" size={12} />
        <a href="/services">Services</a>
        <Icon name="chevron-right" size={12} />
        <a href="/products">Packages</a>
        <Icon name="chevron-right" size={12} />
        <span>{name}</span>
      </nav>

      <section className="cond-hero">
        <div className="cond-hero-text">
          <div className="sec-label"><span>Package</span></div>
          <h1>{name}</h1>
          <p className="cond-hero-desc">{description}</p>
          <div className="hero-pills">
            {(pills.length > 0 ? pills : ['All-Inclusive','EMI Available','Insurance Accepted']).map((pill, i) => (
              <span key={i} className="hero-pill" style={pillStyles[i % pillStyles.length]}>
                <Icon name="check" size={12} />
                {' '}{pill}
              </span>
            ))}
          </div>
          {priceRange && (
            <div className="pkg-price">
              <span className="pkg-price-val">{priceRange}</span>
              {priceUnit && <span className="pkg-price-note">{priceUnit}</span>}
            </div>
          )}
          <a href={appointmentUrl} className="pkg-enquire" onClick={e => { e.preventDefault(); typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("openAppointmentModal")) }}>
            Enquire Now <Icon name="arrow-right" size={16} />
          </a>
        </div>
        <div className="cond-hero-img" style={{ background: 'linear-gradient(145deg,var(--secondary-deep),var(--secondary),var(--primary))', position: 'relative', overflow: 'hidden' }}>
          {heroImage ? (
            <Image src={heroImage} alt={`${name} at ${clinicName}`} fill style={{ objectFit: 'cover' }} priority />
          ) : (
            <Icon name="briefcase" size={48} color="rgba(255,255,255,0.2)" />
          )}
        </div>
      </section>

      {inclusions.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Inclusions</span></div>
              <h2 className="sec-title">What&apos;s included in this package.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>Everything you need — from first consultation to final follow-up — in one transparent package.</p>
            </div>
            <div className="incl-grid">
              {inclusions.map((incl, i) => (
                <div key={i} className="incl-card">
                  <div className="incl-card-head">
                    <div className="incl-icon" style={{ background: iconGrads[i % iconGrads.length] }}>
                      <Icon name={inclIconNames[i % inclIconNames.length]} size={16} color="#FFFFFF" />
                    </div>
                    <h3>{incl.category}</h3>
                  </div>
                  <ul>{incl.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {howItWorks.length > 0 && (
        <div className="sec-white">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Your Journey</span></div>
              <h2 className="sec-title">How this package works.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>A clear, structured path from enquiry to full recovery.</p>
            </div>
            <div className="steps-flow">
              {howItWorks.map((step, i) => (
                <div key={i} style={{ display: 'contents' }}>
                  <div className={`sf-card ${sfClasses[i % sfClasses.length]}`}>
                    <div className="sf-top">
                      <span className="sf-badge">Step {String(i + 1).padStart(2, '0')}</span>
                      <div className="sf-icon">
                        <Icon name={stepIconNames[i % stepIconNames.length]} size={22} color="#FFFFFF" />
                      </div>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  {i < howItWorks.length - 1 && (
                    <>
                      <div className="sf-arrow-h"><Icon name="chevron-right" size={22} /></div>
                      <div className="sf-arrow-v"><Icon name="chevron-down" size={22} /></div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {whoIsItFor.length > 0 && (
        <div className="sec-teal">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Suitability</span></div>
              <h2 className="sec-title">Who is this package for?</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>Designed for patients who want a complete, hassle-free solution.</p>
            </div>
            <div className="who-grid">
              {whoIsItFor.map((item, i) => (
                <div key={i} className="who-pill">
                  <div className="who-icon" style={{ background: iconGrads[i % iconGrads.length] }}>
                    <Icon name="check" size={14} color="#FFFFFF" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {pricingRows.length > 0 && (
        <div className="sec-white">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Pricing</span></div>
              <h2 className="sec-title">Pricing breakdown.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>Transparent pricing with no hidden charges. Exact cost confirmed after consultation.</p>
            </div>
            <div className="pricing-breakdown">
              <div className="pb-header">
                <h3>{pricingTitle ?? name}</h3>
                {pricingSubtitle && <p>{pricingSubtitle}</p>}
              </div>
              <div className="pb-rows">
                {pricingRows.map((row, i) => (
                  <div key={i} className="pb-row">
                    <span className="pb-row-label">{row.label}</span>
                    <span className="pb-row-val">{row.value}</span>
                  </div>
                ))}
              </div>
              {pricingTotal && (
                <div className="pb-total">
                  <span className="pb-total-label">{pricingTotal.label}</span>
                  <span className="pb-total-val">{pricingTotal.value}</span>
                </div>
              )}
              {pricingNote && <div className="pb-note">{pricingNote}</div>}
            </div>
          </div>
        </div>
      )}

      {paymentOptions.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Payment</span></div>
              <h2 className="sec-title">Payment options.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>Multiple ways to pay — we&apos;ll help you find the most convenient option.</p>
            </div>
            <div className="incl-grid">
              {paymentOptions.map((opt, i) => (
                <div key={i} className="incl-card">
                  <div className="incl-card-head">
                    <div className="incl-icon" style={{ background: iconGrads[i % iconGrads.length] }}>
                      <Icon name={payIconNames[i % payIconNames.length]} size={16} color="#FFFFFF" />
                    </div>
                    <h3>{opt.title}</h3>
                  </div>
                  <ul>{opt.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {testimonials.length > 0 && (
        <div className="sec-white">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Testimonials</span></div>
              <h2 className="sec-title">What our patients say.</h2>
            </div>
            <div className="test-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="test-card">
                  <div className="test-stars">{'★'.repeat(t.rating ?? 5)}</div>
                  <p className="test-text">&ldquo;{t.text}&rdquo;</p>
                  <div className="test-author">
                    <div className="test-avatar" style={{ background: i === 0 ? 'linear-gradient(135deg,var(--primary),var(--secondary))' : 'linear-gradient(135deg,var(--secondary),var(--secondary-deep))' }}>
                      <Icon name="user" size={20} color="rgba(255,255,255,0.5)" />
                    </div>
                    <div>
                      <span className="test-name">{t.name}</span>
                      <span className="test-detail">{t.detail}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {relatedProcedures.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header">
              <div className="sec-label"><span>Related</span></div>
              <h2 className="sec-title">Related procedures.</h2>
            </div>
            <div className="rel-card">
              <div className="rel-head">Related Procedures</div>
              {relatedProcedures.map((proc, i) => (
                <a key={i} href={`/procedures/${proc.slug}`} className="rel-row">
                  <span>{proc.name}</span>
                  <Icon name="arrow-right" size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {faqs.length > 0 && (
        <div className="sec-white">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>FAQ</span></div>
              <h2 className="sec-title">About this package.</h2>
            </div>
            <div className="faq-list" itemScope itemType="https://schema.org/FAQPage">
              {faqs.map((f, i) => (
                <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <div className="faq-q">
                    <span itemProp="name">{f.question}</span>
                    <div className="faq-toggle"><Icon name="check" size={16} /></div>
                  </div>
                  {openFaq === i && (
                    <div className="faq-a" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                      <p itemProp="text">{f.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="cta-band">
        <div className="cta-band-inner">
          <div className="cta-band-content">
            <h2>Interested in this package?</h2>
            <p>Get a personalised cost estimate. No commitment required — just a conversation to help you understand your options.</p>
          </div>
          <div className="cta-band-actions">
            <a href={appointmentUrl} className="cta-primary" onClick={e => { e.preventDefault(); typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("openAppointmentModal")) }}>
              Book Appointment <Icon name="arrow-right" size={16} />
            </a>
            <a href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : 'https://wa.me/919999999999'}
               className="cta-secondary" target="_blank" rel="noopener noreferrer">
              WhatsApp Us <Icon name="whatsapp" size={16} />
            </a>
          </div>
          <div className="cta-band-info">
            {clinicAddress && <span>📍 {clinicAddress}</span>}
            {clinicHours && <span>🕐 {clinicHours}</span>}
          </div>
        </div>
      </section>
    </>
  )
}
