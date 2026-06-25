'use client'
import { useState } from 'react'
import { Icon } from '@/lib/icons'

const faqs = [
  { q: 'Are these reviews verified?', a: 'Yes, all reviews shown here are sourced from Google Reviews and are from verified patients. We do not edit or filter reviews.' },
  { q: 'How can I leave a review?', a: 'Click the Write a Review button above to go directly to our Google listing. We appreciate your honest feedback -- it helps other patients make informed decisions.' },
  { q: 'What if I have a concern about my treatment?', a: 'Please contact the clinic directly. We take every concern seriously and will work to resolve any issues promptly. Your satisfaction and wellbeing are our priority.' },
  { q: 'How is the waiting time at the clinic?', a: 'We operate on a scheduled appointment system to minimise waiting time. Walk-ins are accommodated but may involve a short wait depending on the day schedule.' },
  { q: 'Is the staff friendly and supportive?', a: 'Our staff is trained to provide a compassionate and supportive environment. From front desk to nursing, every team member is focused on making your visit as comfortable as possible.' },
]

export default function TestimonialsFAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="faq-section" style={{ background: 'var(--neutral-100)' }}>
      <div className="faq-inner">
        <div className="sec-header faq-header">
          <div className="sec-label"><span>FAQ</span></div>
          <h2 className="sec-title">About patient experience.</h2>
          <p className="sec-sub">Questions about consultations, hospital experience, and care quality.</p>
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
