import type { WhyCard } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function WhyChoose({ cards }: { cards: WhyCard[] }) {
  return (
    <section className="why-section">
      <div className="sec-header">
        <div className="sec-label"><span>Why Choose Us</span></div>
        <h2 className="sec-title">The difference.</h2>
        <p className="sec-sub">What sets us apart in delivering care that patients trust.</p>
      </div>
      <div className="why-grid">
        {cards.map((card, i) => (
          <div key={i} className="why-card">
            <div className={`why-icon ${card.iconColor}`}>
              <Icon name={card.iconType || 'check'} size={28} color="#FFFFFF" />
            </div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
