import type { ReviewItem, ReviewSummary } from '@/lib/types'
import { Icon } from '@/lib/icons'

const GoogleStars = ({ size = 20 }: { size?: number }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[0,1,2,3,4].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#F59E0B">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
)

export default function Reviews({ reviews, summary }: { reviews: ReviewItem[]; summary: ReviewSummary }) {
  return (
    <section className="reviews-section">
      <div className="reviews-inner">
        <div className="sec-header">
          <div className="sec-label"><span>Patient Reviews</span></div>
          <h2 className="sec-title">What our patients say.</h2>
          <div className="reviews-rating">
            <span className="reviews-score">{summary.score}</span>
            <GoogleStars size={28} />
          </div>
        </div>
        <div className="reviews-grid">
          {reviews.map((review, i) => (
            <div key={i} className="review-card">
              <div className="review-top">
                <div className="review-avatar">{review.initials}</div>
                <div className="review-meta">
                  <span className="review-name">{review.name}</span>
                  <span className="review-date">{review.date}</span>
                </div>
                <GoogleStars size={16} />
              </div>
              <p>&ldquo;{review.text}&rdquo;</p>
            </div>
          ))}
        </div>
        <div className="reviews-actions">
          <a href={summary.googleUrl} target="_blank" rel="noreferrer" className="rev-btn rev-more">
            Read More Reviews <Icon name="arrow-right" size={16} />
          </a>
          <a href={summary.googleUrl} target="_blank" rel="noreferrer" className="rev-btn rev-write">
            Write a Review <Icon name="external-link" size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
