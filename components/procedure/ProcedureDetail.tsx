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
const procNumGrads = [
  'linear-gradient(135deg,var(--primary),var(--primary-dark))',
  'linear-gradient(135deg,var(--secondary),var(--secondary-dark))',
  'linear-gradient(135deg,var(--secondary-deep),var(--secondary-deep))',
  'linear-gradient(135deg,#D68910,#B7770A)',
  'linear-gradient(135deg,var(--primary),var(--primary-dark))',
]
const recBadgeColors = ['var(--primary)', 'var(--secondary)', 'var(--secondary-deep)', '#D68910']
const stepIconNames = ['message', 'search', 'file', 'check-circle']
const sfClasses = ['sf-1','sf-2','sf-3','sf-4']

export interface ProcedureDetailProps {
  name: string
  slug?: string
  description?: string
  pills?: string[]
  heroStats?: { label: string; value: string }[]
  heroImage?: string | null
  quickFacts?: { label: string; value: string }[]
  candidacy?: string[]
  candidacyIntro?: string
  successRateItems?: string[]
  risksItems?: string[]
  sideEffectsItems?: string[]
  riskNote?: string
  steps?: { title: string; description: string }[]
  timelines?: { label: string; value: string; description: string }[]
  howWeHandle?: { title: string; description: string }[]
  recoveryPhases?: {
    label: string; title: string; description: string
    timeline?: { badge: string; text: string }[]
    warnings?: string[]
  }[]
  outcomes?: { title: string; description: string }[]
  myths?: { myth: string; fact: string }[]
  ifDelayed?: { title?: string; intro?: string; items?: string[] }
  relatedConditions?: { name: string; slug: string }[]
  allConditions?: { name: string; slug: string }[]
  allProcedures?: { name: string; slug: string }[]
  doctorName?: string
  faqs?: { question: string; answer: string }[]
  clinicName?: string
  clinicAddress?: string
  clinicHours?: string
  whatsappNumber?: string
  appointmentUrl?: string
}

export default function ProcedureDetail({
  name = 'Procedure',
  description = '',
  pills = [],
  heroStats = [],
  heroImage,
  quickFacts = [],
  candidacy = [],
  candidacyIntro,
  successRateItems = [],
  risksItems = [],
  sideEffectsItems = [],
  riskNote,
  steps = [],
  timelines = [],
  howWeHandle = [],
  recoveryPhases = [],
  outcomes = [],
  myths = [],
  ifDelayed,
  relatedConditions = [],
  faqs = [],
  clinicName = '',
  clinicAddress = '',
  clinicHours = '',
  whatsappNumber = '',
  appointmentUrl = '/appointment',
}: ProcedureDetailProps) {
  const [activeRecTab, setActiveRecTab] = useState(0)
  const [openMyth,     setOpenMyth]     = useState<number | null>(null)
  const [openFaq,      setOpenFaq]      = useState<number | null>(null)

  const hasTransparency = successRateItems.length > 0 || risksItems.length > 0 || sideEffectsItems.length > 0

  return (
    <>
      <nav className="breadcrumb">
        <a href="/">Home</a>
        <Icon name="chevron-right" size={12} />
        <a href="/services">Services</a>
        <Icon name="chevron-right" size={12} />
        <a href="/services#procedures">Procedures</a>
        <Icon name="chevron-right" size={12} />
        <span>{name}</span>
      </nav>

      <section className="cond-hero">
        <div className="cond-hero-text">
          <div className="sec-label"><span>Procedure</span></div>
          <h1>{name}</h1>
          <p className="cond-hero-desc">{description}</p>
          <div className="hero-pills">
            {(pills.length > 0 ? pills : ['Gold Standard','95%+ Success Rate','Walk in 24-48 hrs']).map((pill, i) => (
              <span key={i} className="hero-pill" style={pillStyles[i % pillStyles.length]}>
                <Icon name="check" size={12} />
                {' '}{pill}
              </span>
            ))}
          </div>
          {heroStats.length > 0 && (
            <div className="hero-stats">
              {heroStats.map((s, i) => (
                <div key={i}>
                  <div className="hero-stat-num" style={{ color: STAT_COLOURS[i % STAT_COLOURS.length] }}>{s.value}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}
          <a href={appointmentUrl} className="cond-hero-cta" onClick={e => { e.preventDefault(); typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("openAppointmentModal")) }}>
            Book a Consultation
            <Icon name="arrow-right" size={16} />
          </a>
        </div>
        <div className="cond-hero-img" style={{ background: 'linear-gradient(145deg,var(--secondary-deep),var(--secondary),var(--primary))', position: 'relative', overflow: 'hidden' }}>
          {heroImage ? (
            <Image src={heroImage} alt={`${name} at ${clinicName}`} fill style={{ objectFit: 'cover' }} priority />
          ) : (
            <Icon name="stethoscope" size={48} color="rgba(255,255,255,0.2)" />
          )}
        </div>
      </section>

      {quickFacts.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>At a Glance</span></div>
              <h2 className="sec-title">Quick facts about this procedure.</h2>
            </div>
            <div className="qf-card">
              <div className="qf-head">Quick Facts</div>
              {quickFacts.map((f, i) => (
                <div key={i} className="qf-row">
                  <span className="qf-label">{f.label}</span>
                  <span className="qf-val">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {candidacy.length > 0 && (
        <div className="sec-white">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Candidacy</span></div>
              <h2 className="sec-title">Who needs {name.toLowerCase()}?</h2>
              {candidacyIntro && <p className="sec-sub" style={{ margin: '0 auto' }}>{candidacyIntro}</p>}
            </div>
            <div className="cand-grid">
              {candidacy.map((item, i) => (
                <div key={i} className="cand-card">
                  <div className="cand-dot" style={{ background: iconGrads[i % iconGrads.length] }}>
                    <Icon name="check" size={12} color="#FFFFFF" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {hasTransparency && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Transparency</span></div>
              <h2 className="sec-title">What you should know before this procedure.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>We believe in honest, upfront disclosure so you can make an informed decision.</p>
            </div>
            <div className="transparency-cards">
              {successRateItems.length > 0 && (
                <div className="transp-card">
                  <div className="transp-icon" style={{ background: iconGrads[0] }}>
                    <Icon name="check-circle" size={20} color="#FFFFFF" />
                  </div>
                  <h3>Success Rate</h3>
                  <ul>{successRateItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </div>
              )}
              {risksItems.length > 0 && (
                <div className="transp-card">
                  <div className="transp-icon" style={{ background: 'linear-gradient(135deg,#D68910,#B7770A)' }}>
                    <Icon name="alert" size={20} color="#FFFFFF" />
                  </div>
                  <h3>Possible Risks</h3>
                  <ul>{risksItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </div>
              )}
              {sideEffectsItems.length > 0 && (
                <div className="transp-card">
                  <div className="transp-icon" style={{ background: iconGrads[1] }}>
                    <Icon name="shield" size={20} color="#FFFFFF" />
                  </div>
                  <h3>Side Effects</h3>
                  <ul>{sideEffectsItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </div>
              )}
            </div>
            {riskNote && (
              <div className="risk-note">
                <Icon name="shield" size={18} />
                <span>{riskNote}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {steps.length > 0 && (
        <div className="sec-teal">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Procedure</span></div>
              <h2 className="sec-title">How {name.toLowerCase()} works.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>A step-by-step look at what happens during this procedure.</p>
            </div>
            <div className="proc-steps">
              {steps.map((step, i) => (
                <div key={i} className="proc-step">
                  <div className="proc-step-line"/>
                  <div className="proc-num" style={{ background: procNumGrads[i % procNumGrads.length] }}>
                    {i + 1}
                  </div>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {timelines.length > 0 && (
        <div className="sec-white">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Timelines</span></div>
              <h2 className="sec-title">Duration & timelines.</h2>
            </div>
            <div className="duration-grid">
              {timelines.map((tl, i) => (
                <div key={i} className="dur-card">
                  <div className="dur-icon" style={{ background: iconGrads[i % iconGrads.length] }}>
                    <Icon name="clock" size={20} color="#FFFFFF" />
                  </div>
                  <h3>{tl.label}</h3>
                  <div className="dur-val">{tl.value}</div>
                  <p>{tl.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {howWeHandle.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Our Approach</span></div>
              <h2 className="sec-title">How we handle this procedure.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>A structured, patient-first approach from first consultation to full recovery.</p>
            </div>
            <div className="steps-flow">
              {howWeHandle.map((step, i) => (
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
                  {i < howWeHandle.length - 1 && (
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

      {recoveryPhases.length > 0 && (
        <div className="sec-white">
          <div className="sec-pad">
            <div className="sec-header">
              <div className="sec-label"><span>Recovery</span></div>
              <h2 className="sec-title">Recovery & aftercare.</h2>
              <p className="sec-sub">What to expect at each stage of your recovery journey.</p>
            </div>
            <div className="recovery-tabs">
              {recoveryPhases.map((phase, i) => (
                <span key={i} className={`rec-tab${activeRecTab === i ? ' active' : ''}`} onClick={() => setActiveRecTab(i)}>
                  {phase.label}
                </span>
              ))}
            </div>
            {recoveryPhases.map((phase, i) => (
              <div key={i} className={`rec-panel${activeRecTab === i ? ' active' : ''}`}>
                <div className="rec-panel-inner">
                  <h3>{phase.title}</h3>
                  {phase.description && <p>{phase.description}</p>}
                  {(phase.timeline ?? []).length > 0 && (
                    <div className="rec-timeline">
                      {phase.timeline!.map((row, j) => (
                        <div key={j} className="rec-tl-row">
                          <span className="rec-tl-badge" style={{ background: recBadgeColors[j % recBadgeColors.length] }}>{row.badge}</span>
                          <span className="rec-tl-text">{row.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {(phase.warnings ?? []).length > 0 && (
                    <div className="rec-warning">
                      <h4><Icon name="alert" size={14} />{' '}Watch for</h4>
                      <ul>{phase.warnings!.map((w, j) => <li key={j}>{w}</li>)}</ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {outcomes.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Outcomes</span></div>
              <h2 className="sec-title">Success & outcomes.</h2>
            </div>
            <div className="outcome-grid">
              {outcomes.map((o, i) => (
                <div key={i} className="outcome-card">
                  <div className="outcome-icon" style={{ background: iconGrads[i % iconGrads.length] }}>
                    <Icon name="check-circle" size={22} color="#FFFFFF" />
                  </div>
                  <h3>{o.title}</h3>
                  <p>{o.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {myths.length > 0 && (
        <div className="sec-white">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Myths vs Facts</span></div>
              <h2 className="sec-title">Common misconceptions.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>Let&apos;s clear up some of the most common myths about {name.toLowerCase()}.</p>
            </div>
            <div className="myth-list">
              {myths.map((m, i) => (
                <div key={i} className={`myth-item${openMyth === i ? ' open' : ''}`}>
                  <div className="myth-q" onClick={() => setOpenMyth(openMyth === i ? null : i)}>
                    <span className="myth-badge">Myth</span>
                    <span>&ldquo;{m.myth}&rdquo;</span>
                    <div className="myth-toggle">
                      <Icon name="check" size={16} />
                    </div>
                  </div>
                  {openMyth === i && (
                    <div className="myth-a">
                      <span className="fact-badge">Fact</span>
                      <p>{m.fact}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {ifDelayed && (
        <div className="sec-white">
          <div className="sec-pad">
            <div className="centered">
              <div className="warning-box">
                <div className="warning-icon"><Icon name="alert" size={20} /></div>
                <div>
                  <h3>{ifDelayed.title ?? `What happens if ${name.toLowerCase()} is delayed?`}</h3>
                  {ifDelayed.intro && <p>{ifDelayed.intro}</p>}
                  {(ifDelayed.items ?? []).length > 0 && (
                    <ul>{ifDelayed.items!.map((item, i) => <li key={i}>{item}</li>)}</ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {relatedConditions.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Related Conditions</span></div>
              <h2 className="sec-title">Conditions we treat.</h2>
            </div>
            <div className="rel-card">
              <div className="rel-head">Related Conditions</div>
              {relatedConditions.map((cond, i) => (
                <a key={i} href={`/conditions/${cond.slug}`} className="rel-row">
                  <span>{cond.name}</span>
                  <Icon name="arrow-right" size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {faqs.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>FAQ</span></div>
              <h2 className="sec-title">About {name.toLowerCase()}.</h2>
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
            <h2>Ready to take the first step?</h2>
            <p>Get a personalised assessment from an experienced specialist. Understand your options, ask your questions, and decide with confidence.</p>
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
