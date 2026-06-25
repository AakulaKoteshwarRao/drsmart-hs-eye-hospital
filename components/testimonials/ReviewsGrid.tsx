import type { ReviewItem } from '@/lib/types'
import { Icon } from '@/lib/icons'

const googleIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function ReviewsGrid({ reviews, googleUrl }: { reviews: ReviewItem[]; googleUrl: string }) {
  return (
    <section className="reviews-section">
      <div className="reviews-inner" style={{ paddingBottom: '1rem' }}>
        <div className="sec-header">
          <div className="sec-label"><span>Patient Reviews</span></div>
          <h2 className="sec-title">What patients say.</h2>
          <p className="sec-sub">Genuine reviews from Google, shared with patient consent.</p>
        </div>
        <div className="reviews-grid">
          {reviews.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-top">
                <div className="review-author">
                  <div className="review-avatar" style={{ background: r.gradient }}>{r.initials}</div>
                  <div>
                    <span className="review-name">{r.name}</span>
                    <span className="review-date">{r.date}</span>
                  </div>
                </div>
                <div className="review-google-icon">{googleIcon}</div>
              </div>
              <div className="review-stars">
                {[0,1,2,3,4].map(j => <Icon key={j} name="star" size={16} color="#F59E0B" weight="fill" />)}
              </div>
              <p className="review-text">{r.text}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', padding: '2rem 2rem 1rem', maxWidth: '1280px', margin: '0 auto' }}>
          <a href={googleUrl} target="_blank" rel="noopener" className="review-btn-primary">
            See All Google Reviews <Icon name="external-link" size={16} />
          </a>
          <a href={googleUrl} target="_blank" rel="noopener" className="review-btn-secondary">
            <Icon name="external-link" size={16} /> Write a Review
          </a>
        </div>
      </div>
    </section>
  )
}
