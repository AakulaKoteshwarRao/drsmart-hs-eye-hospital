import { Icon } from '@/lib/icons'

const points = [
  'All ranges are estimates',
  'Exact costs confirmed at consultation',
  'No hidden charges',
  'EMI available on request',
]

export default function PricingTransparency() {
  return (
    <section className="pricing-note-section">
      <div className="pricing-note-inner">
        <h2>Transparent pricing. No surprises.</h2>
        <div className="pricing-points">
          {points.map((pt, i) => (
            <div key={i} className="pricing-point">
              <Icon name="check" size={16} color="var(--primary)" />
              {pt}
            </div>
          ))}
        </div>
        <p className="pricing-disclaimer">Full treatment cost is explained before any procedure begins. Insurance and cashless options are supported.</p>
      </div>
    </section>
  )
}
