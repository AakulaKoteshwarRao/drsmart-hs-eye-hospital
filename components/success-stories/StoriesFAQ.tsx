"use client"
import { useState } from 'react'
import { getConfig } from '@/lib/config'
import { Icon } from '@/lib/icons'

export default function StoriesFAQ() {
  const cfg = getConfig()
  const specialty = cfg.clinic?.medicalSpecialty || cfg.doctor?.jobTitle || 'medical'
  const [open, setOpen] = useState<number | null>(null)

  const faqs = [
    { q: 'Are these real patient stories?', a: 'Yes. Every video features a real patient sharing their genuine treatment experience. All stories are recorded with patient consent.' },
    { q: `What is the typical success rate for ${specialty.toLowerCase()} treatments?`, a: `${specialty} treatments generally have a high success rate. However, individual outcomes depend on the specific condition, overall health, and post-operative care. The doctor will discuss realistic expectations during consultation.` },
    { q: 'How long does recovery typically take?', a: 'Recovery varies by procedure and individual. Timelines depend on the treatment, your overall health, and how closely you follow post-care instructions. Full recovery timelines are discussed in detail during your consultation.' },
    { q: 'Will my results be similar to these patients?', a: 'Every patient is different. While these stories represent positive outcomes, individual results depend on your specific condition, health, and commitment to post-treatment care. The doctor will set realistic expectations based on your case.' },
    { q: 'Can I share my own success story?', a: 'We would love to hear from you. If you would like to share your treatment experience, please contact the clinic. Patient stories help others make informed decisions about their care.' },
  ]

  return (
    <section className="faq-section" style={{ background: 'var(--neutral-100)' }}>
      <div className="faq-inner">
        <div className="sec-header faq-header">
          <div className="sec-label"><span>FAQ</span></div>
          <h2 className="sec-title">About treatment outcomes.</h2>
          <p className="sec-sub">What patients want to know about results and recovery.</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item${open === i ? ' open' : ''}`} onClick={() => setOpen(open === i ? null : i)} style={{ cursor: 'pointer' }}>
              <div className="faq-q">
                <span>{faq.q}</span>
                <div className="faq-toggle" style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s', borderColor: open === i ? 'var(--primary)' : undefined }}>
                  <Icon name="check" size={16} color={open === i ? 'var(--primary)' : 'currentColor'} />
                </div>
              </div>
              {open === i && <div className="faq-a" style={{ padding: '0 1.5rem 1.5rem' }}><p>{faq.a}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
