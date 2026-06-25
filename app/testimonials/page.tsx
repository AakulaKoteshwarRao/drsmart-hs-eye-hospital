import Header from '@/components/Header'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import PageDisabled from '@/components/PageDisabled'
import TestimonialsHero from '@/components/testimonials/TestimonialsHero'
import ReviewsGrid from '@/components/testimonials/ReviewsGrid'
import TestimonialsFAQ from '@/components/testimonials/TestimonialsFAQ'
export const dynamic = 'force-dynamic'
import { loadConfig } from '@/lib/config'
import Footer from '@/components/Footer'
import '@/app/styles/testimonials.css'

export default async function TestimonialsPage() {
  const cfg = await loadConfig()
  return (
    <>
      <Header clinic={cfg.clinic} />
      {cfg.optionalPages.testimonials ? (
        <main>
          <TestimonialsHero rating={cfg.testimonials.rating} reviewCount={cfg.testimonials.reviewCount} />
          <ReviewsGrid reviews={cfg.testimonials.reviews} googleUrl={cfg.testimonials.googleUrl} />
          <TestimonialsFAQ />
          <CTABand cta={cfg.ctaBand} />
          <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      ) : (
        <PageDisabled title="Testimonials" clinic={cfg.clinic} />
      )}
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
