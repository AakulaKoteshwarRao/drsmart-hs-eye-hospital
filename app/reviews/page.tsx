import Header from '@/components/Header'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import PageDisabled from '@/components/PageDisabled'
import TestimonialsHero from '@/components/testimonials/TestimonialsHero'
import ReviewsGrid from '@/components/testimonials/ReviewsGrid'
import TestimonialsFAQ from '@/components/testimonials/TestimonialsFAQ'
import SchemaMarkup from '@/components/SchemaMarkup'
import { generatePageSchemas } from '@/lib/schema/index.js'
import { buildSchemaConfig } from '@/lib/schema/master.config.js'
export const revalidate = 3600
import { loadConfig } from '@/lib/config'
import Footer from '@/components/Footer'
import '@/app/styles/testimonials.css'

export default async function TestimonialsPage() {
  const cfg = await loadConfig()
  const sc = buildSchemaConfig(cfg)
  const pageSchemas = generatePageSchemas(sc, {
    pageType: 'page',
    meta: {
      path:        '/reviews',
      name:        `Patient Reviews | ${sc.clinic.name}`,
      description: `Read what patients say about ${sc.clinic.name}.`,
      image:       sc.clinic.image,
      breadcrumb:  [
        { name: 'Home', url: sc.site.url, path: '/' },
        { name: 'Patient Reviews', url: sc.site.url + '/reviews', path: '/reviews' },
      ],
    },
  })
  return (
    <>
      <Header clinic={cfg.clinic} />
      {cfg.optionalPages.testimonials ? (
        <main>
          <SchemaMarkup graphs={[pageSchemas]} />
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
