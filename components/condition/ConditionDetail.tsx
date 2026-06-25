'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Icon } from '@/lib/icons'
import { PILL_STYLES as pillStyles, STAT_COLOURS } from '@/lib/pills'


const stageBadgeColors = ['var(--primary)', '#D68910', '#EF4444']
const stageLabels = ['Early Stage', 'Moderate', 'Advanced']
const stageSubLabels = ['Mild discomfort', 'Increasing impact', 'Significant limitation']
const recBadgeColors = ['var(--primary)', 'var(--secondary)', 'var(--secondary-deep)']
const typeIconGrads = [
  'linear-gradient(135deg,var(--primary),var(--primary-dark))',
  'linear-gradient(135deg,var(--secondary),var(--secondary-dark))',
  'linear-gradient(135deg,var(--secondary-deep),var(--secondary-deep))',
]
const outcomeIconGrads = [
  'linear-gradient(135deg,var(--primary),var(--primary-dark))',
  'linear-gradient(135deg,var(--secondary),var(--secondary-dark))',
  'linear-gradient(135deg,var(--secondary-deep),var(--secondary-deep))',
  'linear-gradient(135deg,#D68910,#B7770A)',
]
const stepIconNames = ['message', 'search', 'file', 'check-circle']
const sfClasses = ['sf-1','sf-2','sf-3','sf-4']

export interface ConditionDetailProps {
  name: string
  slug: string
  description: string
  pills?: string[]
  heroStats?: { label: string; value: string }[]
  heroImage?: string | null
  icd10Code?: string
  prevalence?: string
  progressionType?: string
  diagnosisMethod?: string
  types?: { name: string; description: string }[]
  causes?: string[]
  symptoms?: { early?: string[]; moderate?: string[]; advanced?: string[] }
  treatments?: {
    name: string; shortDescription?: string; description: string
    invasiveness?: string
    invasivenessStyle?: { background: string; color: string }
    items?: string[]
  }[]
  howWeHandle?: { title: string; description: string }[]
  recoveryPhases?: {
    label: string; title: string; description: string
    timeline?: { badge: string; text: string }[]
    warnings?: string[]
  }[]
  outcomes?: { title: string; description: string }[]
  ifNotTreated?: string
  whenToSeeDoctor?: { intro?: string; items?: string[] }
  relatedProcedures?: { name: string; slug: string }[]
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

export default function ConditionDetail({
  name = 'Condition',
  description = '',
  pills = [],
  heroStats = [],
  heroImage,
  icd10Code,
  prevalence,
  progressionType,
  diagnosisMethod,
  types = [],
  causes = [],
  symptoms,
  treatments = [],
  howWeHandle = [],
  recoveryPhases = [],
  outcomes = [],
  ifNotTreated,
  whenToSeeDoctor,
  relatedProcedures = [],
  relatedConditions = [],
  allConditions = [],
  allProcedures = [],
  doctorName = '',
  faqs = [],
  clinicName = '',
  clinicAddress = '',
  clinicHours = '',
  whatsappNumber = '',
  appointmentUrl = '/appointment',
}: ConditionDetailProps) {
  const [activeType,   setActiveType]   = useState(0)
  const [activeTreat,  setActiveTreat]  = useState<number | null>(0)
  const [activeRecTab, setActiveRecTab] = useState(0)
  const [openFaq,      setOpenFaq]      = useState<number | null>(null)

  const symptomGroups = [
    { items: symptoms?.early    ?? [], idx: 0 },
    { items: symptoms?.moderate ?? [], idx: 1 },
    { items: symptoms?.advanced ?? [], idx: 2 },
  ].filter(g => g.items.length > 0)

  return (
    <>
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <a href="/">Home</a>
        <Icon name="chevron-right" size={12} />
        <a href="/services">Services</a>
        <Icon name="chevron-right" size={12} />
        <a href="/services#conditions">Conditions</a>
        <Icon name="chevron-right" size={12} />
        <span>{name}</span>
      </nav>

      {/* S1 — Hero */}
      <section className="cond-hero">
        <div className="cond-hero-text">
          <div className="sec-label"><span>Condition</span></div>
          <h1>{name}</h1>
          <p className="cond-hero-desc">{description}</p>
          <div className="hero-pills">
            {(pills.length > 0 ? pills : ['Treatable','Early Detection Matters','Multiple Options']).map((pill, i) => (
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
            <Icon name="eye" size={48} color="rgba(255,255,255,0.2)" />
          )}
        </div>
      </section>

      {/* S2 — Quick Facts */}
      {(icd10Code || prevalence || progressionType || diagnosisMethod) && (
        <div className="sec-white">
          <div className="sec-pad" style={{ maxWidth: '560px', margin: '0 auto' }}>
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label"><span>Quick Facts</span></div>
              <h2 className="sec-title">At a glance.</h2>
            </div>
            <div className="cond-qf-card">
              <div className="cond-qf-head">Clinical Overview</div>
              {icd10Code && <div className="cond-qf-row"><span className="cond-qf-label">ICD-10 Code</span><span className="cond-qf-val">{icd10Code}</span></div>}
              {prevalence && <div className="cond-qf-row"><span className="cond-qf-label">Prevalence</span><span className="cond-qf-val">{prevalence}</span></div>}
              {progressionType && <div className="cond-qf-row"><span className="cond-qf-label">Progression Type</span><span className="cond-qf-val">{progressionType}</span></div>}
              {diagnosisMethod && <div className="cond-qf-row"><span className="cond-qf-label">Diagnosis Method</span><span className="cond-qf-val">{diagnosisMethod}</span></div>}
            </div>
          </div>
        </div>
      )}

      {/* S3 — Types */}
      {types.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header">
              <div className="sec-label"><span>Types</span></div>
              <h2 className="sec-title">Types of {name.toLowerCase()}.</h2>
            </div>
            <div className="types-tabs">
              {types.map((t, i) => (
                <span key={i} className={`type-tab${activeType === i ? ' active' : ''}`} onClick={() => setActiveType(i)}>
                  {t.name}
                </span>
              ))}
            </div>
            {types.map((t, i) => (
              <div key={i} className={`type-panel${activeType === i ? ' active' : ''}`}>
                <div className="type-panel-inner">
                  <div className="type-icon" style={{ background: typeIconGrads[i % typeIconGrads.length] }}>
                    <Icon name="info" size={24} color="#FFFFFF" />
                  </div>
                  <div className="type-info">
                    <h3>{t.name}</h3>
                    <p>{t.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* S3 — Causes */}
      {causes.length > 0 && (
        <div className="sec-white">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Causes</span></div>
              <h2 className="sec-title">What causes {name.toLowerCase()}?</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>Multiple factors can contribute to the development and progression of this condition.</p>
            </div>
            <div className="cause-grid">
              {causes.map((cause, i) => (
                <div key={i} className="cause-pill">
                  <div className="cause-icon" style={{ background: typeIconGrads[i % typeIconGrads.length] }}>
                    <Icon name="clock" size={18} color="#FFFFFF" />
                  </div>
                  {cause}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* S4 — Symptoms */}
      {symptomGroups.length > 0 && (
        <div className="sec-teal">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Symptoms</span></div>
              <h2 className="sec-title">Signs to look out for.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>
                {name} develops gradually. Recognising symptoms early gives you more treatment options.
              </p>
            </div>
            <div className="symptom-timeline">
              {symptomGroups.map((group, gi) => (
                <div key={gi}>
                  {gi > 0 && <div className="stage-divider" />}
                  <div className="symptom-stage">
                    <div className="stage-header">
                      <span className="stage-badge" style={{ background: stageBadgeColors[group.idx] }}>
                        {stageLabels[group.idx]}
                      </span>
                      <span className="stage-label">{stageSubLabels[group.idx]}</span>
                    </div>
                    <div className="symptom-items">
                      {group.items.map((item, ii) => (
                        <div key={ii} className="symptom-row">
                          <span className="sym-dot" style={{ background: stageBadgeColors[group.idx] }}>
                            <Icon name="check" size={12} color="#FFFFFF" />
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* S5 — Treatment */}
      {treatments.length > 0 && (
        <div className="sec-white">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Treatment</span></div>
              <h2 className="sec-title">Treatment options available.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>
                From conservative to surgical — we always start with the least invasive option first.
              </p>
            </div>
            <div className="treat-grid">
              {treatments.map((t, i) => {
                const isActive = activeTreat === i
                return (
                  <div key={i} className="treat-item">
                    <div className={`treat-card${isActive ? ' active' : ''}`} onClick={() => setActiveTreat(isActive ? null : i)}>
                      <div className="ts-node" style={{ background: typeIconGrads[i % typeIconGrads.length] }}>
                        <Icon name="pulse" size={22} color="#FFFFFF" />
                      </div>
                      <div className="ts-label">{t.name}</div>
                      {t.invasiveness && (
                        <span className="ts-invasive" style={t.invasivenessStyle ?? { background: 'var(--primary-light)', color: 'var(--primary)' }}>
                          {t.invasiveness}
                        </span>
                      )}
                      <div className="ts-hint">
                        View details
                        <Icon name="chevron-down" size={14} />
                      </div>
                    </div>
                    {isActive && t.items && t.items.length > 0 && (
                      <div className="ts-expand open">
                        <h3>{t.name}</h3>
                        <ul>{t.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* S6 — How We Handle */}
      {howWeHandle.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Our Approach</span></div>
              <h2 className="sec-title">How we handle this condition.</h2>
              <p className="sec-sub" style={{ margin: '0 auto' }}>A structured, patient-first approach from first visit to full recovery.</p>
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
                      <div className="sf-arrow-h">
                        <Icon name="chevron-right" size={22} />
                      </div>
                      <div className="sf-arrow-v">
                        <Icon name="chevron-down" size={22} />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* S7 — Recovery */}
      {recoveryPhases.length > 0 && (
        <div className="sec-white">
          <div className="sec-pad">
            <div className="sec-header">
              <div className="sec-label"><span>Recovery</span></div>
              <h2 className="sec-title">Recovery & aftercare.</h2>
              <p className="sec-sub">What to expect at each phase of recovery.</p>
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
                          <span className="rec-tl-badge" style={{ background: recBadgeColors[j % recBadgeColors.length] }}>
                            {row.badge}
                          </span>
                          <span className="rec-tl-text">{row.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {(phase.warnings ?? []).length > 0 && (
                    <div className="rec-warning">
                      <h4>
                        <Icon name="alert" size={14} />
                        {' '}Watch for
                      </h4>
                      <ul>{phase.warnings!.map((w, j) => <li key={j}>{w}</li>)}</ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* S8 — Outcomes */}
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
                  <div className="outcome-icon" style={{ background: outcomeIconGrads[i % outcomeIconGrads.length] }}>
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

      {/* S9 — If Not Treated */}
      {ifNotTreated && (
        <div className="sec-white">
          <div className="sec-pad">
            <div className="centered">
              <div className="warning-box">
                <div className="warning-icon">
                  <Icon name="alert" size={20} />
                </div>
                <div>
                  <h3>What happens if {name} is left untreated?</h3>
                  <p>{ifNotTreated}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* S10 — When to See Doctor */}
      {whenToSeeDoctor && (whenToSeeDoctor.intro || (whenToSeeDoctor.items ?? []).length > 0) && (
        <div className="sec-teal">
          <div className="sec-pad">
            <div className="centered">
              <div className="see-doctor-box">
                <div className="see-doc-icon">
                  <Icon name="pulse" size={20} />
                </div>
                <div>
                  <h3>When should you see a doctor?</h3>
                  {whenToSeeDoctor.intro && <p>{whenToSeeDoctor.intro}</p>}
                  {(whenToSeeDoctor.items ?? []).length > 0 && (
                    <ul>{whenToSeeDoctor.items!.map((item, i) => <li key={i}>{item}</li>)}</ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* S11 — FAQ */}
      {faqs.length > 0 && (
        <div className="sec-white">
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
                    <div className="faq-toggle">
                      <Icon name="check" size={16} />
                    </div>
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

      {/* S12 — Related Procedures */}
      {relatedProcedures.length > 0 && (
        <div className="sec-grey">
          <div className="sec-pad">
            <div className="sec-header" style={{ textAlign: 'center' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}><span>Related Care</span></div>
              <h2 className="sec-title">Procedures we offer.</h2>
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

      {/* Internal Links — SEO section with min 10 links */}
      <div className="sec-white">
        <div className="sec-pad">
          <div className="sec-header" style={{ textAlign: 'center' }}>
            <div className="sec-label" style={{ justifyContent: 'center' }}><span>Explore More</span></div>
            <h2 className="sec-title">Related resources.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {/* Related Procedures */}
            {relatedProcedures.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--primary)' }}>Related Procedures</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {relatedProcedures.map((p, i) => (
                    <a key={i} href={`/procedures/${p.slug}`} style={{ fontSize: '0.88rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Icon name="arrow-right" size={12} />{p.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {/* Related Conditions */}
            {(relatedConditions.length > 0 || allConditions.length > 0) && (
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--primary)' }}>Related Conditions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(relatedConditions.length > 0 ? relatedConditions : allConditions).slice(0, 4).map((c, i) => (
                    <a key={i} href={`/conditions/${c.slug}`} style={{ fontSize: '0.88rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Icon name="arrow-right" size={12} />{c.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {/* Quick Links */}
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--primary)' }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {doctorName && (
                  <a href="/doctor" style={{ fontSize: '0.88rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Icon name="arrow-right" size={12} />Meet {doctorName}
                  </a>
                )}
                <a href="/appointment" style={{ fontSize: '0.88rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Icon name="arrow-right" size={12} />Book Appointment
                </a>
                <a href="/contact" style={{ fontSize: '0.88rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Icon name="arrow-right" size={12} />Contact Us
                </a>
                <a href="/services" style={{ fontSize: '0.88rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Icon name="arrow-right" size={12} />All Services
                </a>
                <a href="/blog" style={{ fontSize: '0.88rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Icon name="arrow-right" size={12} />Health Articles
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Band */}
      <section className="cta-band">
        <div className="cta-band-inner">
          <div className="cta-band-content">
            <h2>Don&apos;t let {name.toLowerCase()} hold you back.</h2>
            <p>Early treatment means more options and better outcomes. Book a consultation to understand your condition and explore the right path forward.</p>
          </div>
          <div className="cta-band-actions">
            <a href={appointmentUrl} className="cta-primary" onClick={e => { e.preventDefault(); typeof window !== "undefined" && window.dispatchEvent(new CustomEvent("openAppointmentModal")) }}>
              Book Appointment{' '}
              <Icon name="arrow-right" size={16} />
            </a>
            <a href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : 'https://wa.me/919999999999'}
               className="cta-secondary" target="_blank" rel="noopener noreferrer">
              WhatsApp Us{' '}
              <Icon name="whatsapp" size={16} />
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
