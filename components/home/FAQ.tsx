'use client'
import { useState } from 'react'
import type { FaqItem } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function FAQ({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <section className="faq-section">
      <div className="faq-inner">
        <div className="sec-header faq-header">
          <div className="sec-label"><span>FAQ</span></div>
          <h2 className="sec-title">Common questions answered.</h2>
          <p className="sec-sub">Everything patients typically want to know before booking a consultation.</p>
        </div>
        <div className="faq-list">
          {items.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="faq-item" onClick={() => setOpenIndex(isOpen ? null : i)} style={{ cursor: 'pointer' }}>
                <div className="faq-q">
                  <span>{item.question}</span>
                  <div className="faq-toggle" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s', borderColor: isOpen ? 'var(--primary)' : undefined }}>
                    <Icon name="check" size={16} color={isOpen ? 'var(--primary)' : 'currentColor'} />
                  </div>
                </div>
                {isOpen && <div className="faq-a" style={{ padding: '0 1.5rem 1.5rem' }}><p>{item.answer}</p></div>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
