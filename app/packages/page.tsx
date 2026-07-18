import Header from '@/components/Header'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import ProductsHero from '@/components/products/ProductsHero'
import PackagesGrid from '@/components/home/PackagesGrid'
import PricingTransparency from '@/components/products/PricingTransparency'
import PackageTestimonials from '@/components/products/PackageTestimonials'
import GuidanceSection from '@/components/products/GuidanceSection'
import ProductsFAQ from '@/components/products/ProductsFAQ'
import SchemaMarkup from '@/components/SchemaMarkup'
import { generatePageSchemas } from '@/lib/schema/index.js'
import { buildSchemaConfig } from '@/lib/schema/master.config.js'
export const revalidate = 3600
import { loadConfig } from '@/lib/config'
import Footer from '@/components/Footer'
import '@/app/styles/products.css'

export default async function ProductsPage() {
  const cfg = await loadConfig()
  const sc = buildSchemaConfig(cfg)
  const pageSchemas = generatePageSchemas(sc, {
    pageType: 'collection',
    meta: {
      path:        '/packages',
      name:        `Packages | ${sc.clinic.name}`,
      description: `Health packages offered by ${sc.clinic.name} with transparent pricing.`,
      image:       sc.clinic.image,
      breadcrumb:  [
        { name: 'Home', url: sc.site.url, path: '/' },
        { name: 'Packages', url: sc.site.url + '/packages', path: '/packages' },
      ],
    },
  })
  return (
    <>
      <SchemaMarkup graphs={[pageSchemas]} />
      <Header clinic={cfg.clinic} />
      <main>
        <ProductsHero />
        <PackagesGrid packages={cfg.packages} showViewAll={false} />
        <PricingTransparency />
        <PackageTestimonials />
        <GuidanceSection clinic={cfg.clinic} />
        <ProductsFAQ />
        <CTABand cta={cfg.ctaBand} />
        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
