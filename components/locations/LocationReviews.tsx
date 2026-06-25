import { getConfig } from '@/lib/config'
import { Icon } from '@/lib/icons'

const fallbackReviews = [
  { quote: 'Very convenient location. Easy to reach. The clinic is well-maintained and the staff is very helpful.', author: 'Suresh R.' },
  { quote: 'I travel some distance for my appointments. It is always worth it. Excellent doctor and clinic.', author: 'Priya D.' },
  { quote: 'Easy to find the clinic. My elderly father had no trouble reaching it. The doctor was very thorough and patient.', author: 'Anil K.' },
]

export default function LocationReviews() {
  const cfg = getConfig()
  const allReviews = cfg.reviews || []
  const reviews = allReviews.length > 0
    ? allReviews.slice(0, 3).map((r: any) => ({ quote: r.text || r.quote, author: r.name || r.author }))
    : fallbackReviews
  return (
    <section className="loc-reviews">
      <div className="sec-header" style={{ textAlign: 'center' }}>
        <div className="sec-label" style={{ justifyContent: 'center' }}><span>Patient Reviews</span></div>
        <h2 className="sec-title">What patients from this area say.</h2>
      </div>
      <div className="loc-reviews-grid">
        {reviews.map((r, i) => (
          <div key={i} className="loc-review-card" style={{ padding: '1.5rem' }}>
            <div className="loc-review-stars">
              {[0,1,2,3,4].map(j => <Icon key={j} name="star" size={16} color="#F59E0B" weight="fill" />)}
            </div>
            <p className="loc-review-text">&quot;{r.quote}&quot;</p>
            <span className="loc-review-name">-- {r.author}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
