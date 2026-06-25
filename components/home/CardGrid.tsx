import type { CardItem } from '@/lib/types'
import { Icon } from '@/lib/icons'

const ArrowIcon = () => <Icon name="arrow-right" size={16} />

interface CardGridProps {
  label: string
  title: string
  subtitle: string
  items: CardItem[]
  viewAllHref: string
  viewAllLabel: string
  bgClass?: string
  wrapInner?: boolean
}

export default function CardGrid({
  label, title, subtitle, items,
  viewAllHref, viewAllLabel, bgClass = '', wrapInner = false
}: CardGridProps) {
  const inner = (
    <>
      <div className="sec-header">
        <div className="sec-label"><span>{label}</span></div>
        <h2 className="sec-title">{title}</h2>
        <p className="sec-sub">{subtitle}</p>
      </div>
      <div className="card-grid">
        {items.map((item, i) => (
          <a key={i} href={item.href} className="img-card">
            <div className={`img-card-visual ${item.gradClass}`} style={{ position: 'relative', overflow: 'hidden' }}>
              {item.image ? (
                <img src={item.image} alt={item.title} width={400} height={300} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              ) : (
                <div className="card-visual-icon">
                  <Icon name={item.iconType || 'info'} size={26} color="#FFFFFF" />
                </div>
              )}
              {!item.image && <span className="card-visual-label" style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>}
            </div>
            <div className="img-card-body" style={{ padding: '1.25rem' }}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="learn-more">Learn more <ArrowIcon /></span>
            </div>
          </a>
        ))}
      </div>
      <div className="sec-cta">
        <a href={viewAllHref}>{viewAllLabel} <ArrowIcon /></a>
      </div>
    </>
  )

  if (wrapInner) {
    return (
      <section className={`card-section alt ${bgClass}`}>
        <div className="card-section-inner">{inner}</div>
      </section>
    )
  }
  return <section className={`card-section ${bgClass}`}>{inner}</section>
}
