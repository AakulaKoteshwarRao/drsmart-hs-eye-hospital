'use client'
import { useState } from 'react'
import type { ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function TeamFAQ({ clinic }: { clinic: ClinicInfo }) {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    { q: 'Can I choose which doctor I see?', a: 'Yes. When booking an appointment, you can select a specific doctor based on their availability and area of specialisation.' },
    { q: 'Are all doctors available every day?', a: `Consulting doctors have specific days and hours. The lead doctor is available ${clinic.hours}. Please check each doctor schedule or call the clinic for availability.` },
    { q: 'Do the consulting doctors operate at this clinic?', a: 'Consultations happen at our clinic. Surgical procedures are performed at our affiliated hospitals depending on the case.' },
    { q: 'Can I get a referral from one doctor to another on the team?', a: 'Absolutely. If your condition requires a different specialisation, your doctor will refer you to the most suitable team member with a full handover of your case details.' },
    { q: 'Is online consultation available with all doctors?', a: 'Online consultation is available with the lead doctor. For consulting doctors, please contact the clinic to check teleconsultation availability.' },
  ]
  return (
    <section className="faq-section" style={{ background: 'var(--neutral-100)' }}>
      <div className="faq-inner">
        <div className="sec-header faq-header">
          <div className="sec-label"><span>FAQ</span></div>
          <h2 className="sec-title">About the team.</h2>
          <p className="sec-sub">Common questions about our doctors and consulting arrangements.</p>
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
