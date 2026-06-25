import type { TrustItem } from '@/lib/types'
import { Icon } from '@/lib/icons'

export default function TrustStrip({ items }: { items: TrustItem[] }) {
  const doubled = [...items, ...items]
  return (
    <section className="trust-strip">
      <div className="trust-marquee">
        {doubled.map((item, i) => (
          <span key={i} style={{ display: 'contents' }}>
            <div className="trust-item">
              <div className="trust-icon" style={{ color: item.iconColor || '#0D9488' }}>
                <Icon name={item.icon || 'shield'} size={18} color={item.iconColor || '#0D9488'} />
              </div>
              {item.text}
            </div>
            <div className="trust-divider"></div>
          </span>
        ))}
      </div>
    </section>
  )
}
