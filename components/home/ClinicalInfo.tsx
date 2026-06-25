import type { ClinicalCard } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function ClinicalInfo({ cards }: { cards: ClinicalCard[] }) {
  return (
    <section className="clinical-section">
      <div className="clinical-inner">
        <div className="sec-header">
          <div className="sec-label"><span>Clinical Transparency</span></div>
          <h2 className="sec-title">What you should know before any procedure.</h2>
          <p className="sec-sub">We believe informed patients make better decisions. Here are the facts -- clearly.</p>
        </div>
        <div className="clinical-grid">
          {cards.map((card, i) => (
            <div key={i} className={`clinical-card ${card.colorClass}`}>
              <div className="cl-icon">
                <Icon name={card.iconType || 'info'} size={24} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <span className="cl-note">{card.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
