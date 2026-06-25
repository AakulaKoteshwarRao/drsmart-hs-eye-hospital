'use client'
import { useState } from 'react'
import type { ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

const baseFaqs = [
  { q: 'Is the clinic accessible for elderly patients?', a: 'Yes, the clinic is designed for accessibility with ground-floor access, wheelchair-friendly spaces, and comfortable seating in the waiting area.' },
  { q: 'Do you provide rehabilitation in-house?', a: 'Yes, we have a dedicated rehabilitation unit within the clinic. Patients receive their treatment and aftercare under one roof.' },
  { q: 'What insurance companies do you accept?', a: 'We accept all major insurance providers including Star Health, HDFC Ergo, ICICI Lombard, and others. Cashless facility and pre-authorisation support is available.' },
  { q: 'Can I get a second opinion?', a: 'Absolutely. We welcome second opinion consultations. Please bring all your previous reports and investigations for a thorough review.' },
]

export default function AboutFAQ({ clinic }: { clinic: ClinicInfo }) {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [{ q: 'When was the clinic established?', a: `The clinic has been serving patients in ${clinic.city}, building a reputation for reliable, patient-first specialist care.` }, ...baseFaqs]
  return (
    <section className="faq-section" style={{ background: 'var(--neutral-100)' }}>
      <div className="faq-inner">
        <div className="sec-header faq-header">
          <div className="sec-label"><span>FAQ</span></div>
          <h2 className="sec-title">About the clinic.</h2>
          <p className="sec-sub">Answers to common questions about our practice.</p>
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
