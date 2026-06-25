'use client'
import { useState } from 'react'
import type { FaqItem } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function DoctorFAQ({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="faq-section" style={{ background: 'var(--neutral-100)' }}>
      <div className="faq-inner">
        <div className="sec-header faq-header">
          <div className="sec-label"><span>FAQ</span></div>
          <h2 className="sec-title">About the doctor.</h2>
          <p className="sec-sub">Common questions patients ask before their consultation.</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item${open === i ? ' open' : ''}`} onClick={() => setOpen(open === i ? null : i)} style={{ cursor: 'pointer' }}>
              <div className="faq-q">
                <span>{faq.question}</span>
                <div className="faq-toggle" style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s', borderColor: open === i ? 'var(--primary)' : undefined }}>
                  <Icon name="check" size={16} color={open === i ? 'var(--primary)' : 'currentColor'} />
                </div>
              </div>
              {open === i && <div className="faq-a" style={{ padding: '0 1.5rem 1.5rem' }}><p>{faq.answer}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
