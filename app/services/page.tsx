import Header from '@/components/Header'
import SchemaMarkup from '@/components/SchemaMarkup'
import { generatePageSchemas } from '@/lib/schema/index.js'
import { buildSchemaConfig } from '@/lib/schema/master.config.js'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import ServicesHero from '@/components/services/ServicesHero'
import ConditionsGrid from '@/components/services/ConditionsGrid'
import EarlyTreatment from '@/components/services/EarlyTreatment'
import ProceduresGrid from '@/components/services/ProceduresGrid'
import ServicesFAQ from '@/components/services/ServicesFAQ'
export const dynamic = 'force-dynamic'
import { loadConfig } from '@/lib/config'
import Footer from '@/components/Footer'
import '@/app/styles/services.css'

export default async function ServicesPage() {
  const cfg = await loadConfig()
  const sc = buildSchemaConfig(cfg)
  const pageSchemas = generatePageSchemas(sc, {
    pageType: 'home',
    meta: {
      path:        '/services',
      name:        `Services | ${sc.clinic.name}`,
      description: sc.clinic.description,
      image:       sc.clinic.image,
      breadcrumb:  [
        { name: 'Home', url: sc.site.url, path: '/' },
        { name: 'Services', url: sc.site.url + '/services', path: '/services' },
      ],
    },
  })

  return (
    <>
      <SchemaMarkup graphs={[pageSchemas]} />
      <Header clinic={cfg.clinic} />
      <main>
        <ServicesHero />
        <ConditionsGrid conditions={cfg.services.conditions} />
        <EarlyTreatment />
        <ProceduresGrid procedures={cfg.services.procedures} />
        <ServicesFAQ />
        <CTABand cta={cfg.ctaBand} />
        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
