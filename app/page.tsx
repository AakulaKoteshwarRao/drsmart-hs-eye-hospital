export const dynamic = 'force-dynamic'
import { loadConfig } from '@/lib/config'
import type { Metadata } from 'next'
import { buildHomeMetadata } from '@/lib/seo'
import SchemaMarkup from '@/components/SchemaMarkup'
import { generatePageSchemas } from '@/lib/schema/index.js'
import { buildSchemaConfig } from '@/lib/schema/master.config.js'
import Header from '@/components/Header'
import StickyBar from '@/components/StickyBar'
import Hero from '@/components/home/Hero'
import TrustStrip from '@/components/home/TrustStrip'
import WhyChoose from '@/components/home/WhyChoose'
import CardGrid from '@/components/home/CardGrid'
import PackagesGrid from '@/components/home/PackagesGrid'
import HowWeWork from '@/components/home/HowWeWork'
import MeetDoctor from '@/components/home/MeetDoctor'
import '@/app/styles/team.css'
import TeamCarousel from '@/components/team/TeamCarousel'
import ClinicalInfo from '@/components/home/ClinicalInfo'
import PatientStories from '@/components/home/PatientStories'
import PricingAccordion from '@/components/home/PricingAccordion'
import Reviews from '@/components/home/Reviews'
import LocalAreas from '@/components/home/LocalAreas'
import FAQ from '@/components/home/FAQ'
import BlogPreview from '@/components/home/BlogPreview'
import CTABand from '@/components/home/CTABand'
import Footer from '@/components/Footer'

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await loadConfig()
  return buildHomeMetadata(cfg)
}

export default async function HomePage() {
  const cfg = await loadConfig()
  const sc = buildSchemaConfig(cfg)

  const pageSchemas = generatePageSchemas(sc, {
    pageType: 'home',
    meta: {
      path:          '/',
      name:          `${sc.clinic.name} | ${sc.clinic.alternateName}`,
      description:   `${sc.clinic.name} -- ${sc.clinic.description}`,
      image:         sc.clinic.image,
      datePublished: '2024-01-01',
      breadcrumb:    [{ name: 'Home', url: sc.site.url, path: '/' }],
    },
  })

  return (
    <>
      <SchemaMarkup graphs={[pageSchemas]} />
      <Header clinic={cfg.clinic} />
      <main>
        <Hero hero={cfg.hero} clinic={cfg.clinic} />
        <TrustStrip items={cfg.trustStrip} />
        <WhyChoose cards={cfg.whyChoose} />
        <CardGrid
          label="Conditions We Treat"
          title="What we treat."
          subtitle="From common to complex conditions -- each diagnosis is approached with precision and care."
          items={cfg.conditions}
          viewAllHref="/services#conditions"
          viewAllLabel="View All Conditions"
        />
        <CardGrid
          label="Procedures"
          title="What we do."
          subtitle="Minimally invasive and surgical procedures performed with modern techniques and premium equipment."
          items={cfg.procedures}
          viewAllHref="/services#procedures"
          viewAllLabel="View All Procedures"
          bgClass="section-cool-grey"
          wrapInner={true}
        />
        <PackagesGrid packages={cfg.packages} />
        <HowWeWork steps={cfg.howWeWork} />
        <MeetDoctor doctor={cfg.doctor} clinic={cfg.clinic} />
        <TeamCarousel members={cfg.team} />
        <ClinicalInfo cards={cfg.clinicalInfo} />
        <PatientStories stories={cfg.patientStories} />
        <PricingAccordion items={cfg.pricing} />
        <Reviews reviews={cfg.reviews} summary={cfg.reviewSummary} />
        <LocalAreas areas={cfg.localAreas} clinic={cfg.clinic} />
        <FAQ items={cfg.faq} />
        <BlogPreview posts={cfg.blog} />
        <CTABand cta={cfg.ctaBand} />
        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
