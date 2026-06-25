import { getConfig } from '@/lib/config'
import { Icon } from '@/lib/icons'

const grads = [
  'linear-gradient(135deg,var(--primary),var(--secondary))',
  'linear-gradient(135deg,var(--secondary-deep),var(--secondary))',
  'linear-gradient(135deg,var(--primary),var(--primary-dark))',
]

export default function PackageTestimonials() {
  const cfg = getConfig()
  const reviews = (cfg.reviews || []).slice(0, 3)
  const packages = cfg.packages || []
  const testimonials = reviews.length > 0
    ? reviews.map((r: any, i: number) => ({ initials: (r.name || 'P').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(), grad: grads[i % grads.length], name: r.name, pkg: packages[i]?.title || 'Treatment Package', quote: r.text }))
    : [
        { initials: 'RK', grad: grads[0], name: 'Rajesh K.', pkg: packages[0]?.title || 'Consultation Package', quote: 'The package was clearly explained. I knew exactly what was included and the total cost. No surprises at all.' },
        { initials: 'SP', grad: grads[1], name: 'Sunitha P.', pkg: packages[1]?.title || 'Treatment Package', quote: 'I was worried about costs but the package was affordable and the results were excellent. Everything explained upfront.' },
        { initials: 'VM', grad: grads[2], name: 'Venkat M.', pkg: packages[2]?.title || 'Follow-up Package', quote: 'The package covered everything -- from tests to treatment to follow-up. A very smooth experience overall.' },
      ]
  return (
    <section className="testimonials-section">
      <div className="sec-header" style={{ textAlign: 'center' }}>
        <div className="sec-label" style={{ justifyContent: 'center' }}><span>Patient Feedback</span></div>
        <h2 className="sec-title">What our patients say.</h2>
        <p className="sec-sub" style={{ margin: '0 auto' }}>Feedback from patients who chose our treatment packages.</p>
      </div>
      <div className="testi-grid">
        {testimonials.map((t, i) => (
          <div key={i} className="testi-card">
            <div className="testi-stars">
              {[0,1,2,3,4].map(j => <Icon key={j} name="star" size={16} color="#F59E0B" weight="fill" />)}
            </div>
            <p className="testi-quote">&quot;{t.quote}&quot;</p>
            <div className="testi-author">
              <div className="testi-avatar" style={{ background: t.grad }}>{t.initials}</div>
              <div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-pkg">{t.pkg}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
