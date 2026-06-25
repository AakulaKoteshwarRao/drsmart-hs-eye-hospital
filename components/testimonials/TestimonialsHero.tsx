import { Icon } from '@/lib/icons'

const googleLogo = (
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function TestimonialsHero({ rating, reviewCount }: { rating: string; reviewCount: string }) {
  return (
    <section className="testi-hero">
      <div className="sec-label"><span>Testimonials</span></div>
      <h1>Trusted by patients. <em>Rated on Google.</em></h1>
      <p className="testi-hero-text">Every review is from a verified patient on Google. We believe in transparency -- real feedback from real people who trusted us with their care.</p>
      <div className="google-rating-card">
        <div className="google-logo">{googleLogo}<span>Google</span></div>
        <div className="google-divider"></div>
        <div className="google-score">
          <span className="google-num">{rating}</span>
          <div className="google-stars">
            {[0,1,2,3,4].map(i => <Icon key={i} name="star" size={16} color="#F59E0B" weight="fill" />)}
          </div>
          <span className="google-count">Based on {reviewCount} reviews</span>
        </div>
      </div>
    </section>
  )
}
