'use client'
import { useState } from 'react'
import type { PricingItem } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function PricingAccordion({ items }: { items: PricingItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="pricing-section">
      <div className="pricing-inner">
        <div className="sec-header">
          <div className="sec-label"><span>Pricing &amp; Insurance</span></div>
          <h2 className="sec-title">Transparent costs. No hidden charges.</h2>
          <p className="sec-sub">We believe patients deserve complete clarity on costs before any treatment begins.</p>
        </div>
        <div className="pricing-accordion">
          {items.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="acc-item" onClick={() => setOpenIndex(isOpen ? null : i)} style={{ cursor: 'pointer' }}>
                <div className={`acc-bar ${item.barClass}`}>
                  <div className="acc-bar-left">
                    <div className="acc-icon">
                      <Icon name={item.iconType || 'shield'} size={22} color="#FFFFFF" />
                    </div>
                    <h3>{item.title}</h3>
                  </div>
                  <div className="acc-toggle" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                    <Icon name="chevron-down" size={20} color="rgba(255,255,255,0.7)" />
                  </div>
                </div>
                {isOpen && (
                  <div className="acc-panel" style={{ padding: '0 1.5rem 1.5rem', maxHeight: 'none', overflow: 'visible' }}>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <ul>
                      {item.points.map((pt, j) => <li key={j}>{pt}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
