import Header from '@/components/Header'
import SchemaMarkup from '@/components/SchemaMarkup'
import { generatePageSchemas } from '@/lib/schema/index.js'
import { buildSchemaConfig } from '@/lib/schema/master.config.js'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import LocationsHero from '@/components/locations/LocationsHero'
import LocationIntro from '@/components/locations/LocationIntro'
import ClinicDetails from '@/components/locations/ClinicDetails'
import MapEmbed from '@/components/locations/MapEmbed'
import HowToReach from '@/components/locations/HowToReach'
import ServicesAtLocation from '@/components/locations/ServicesAtLocation'
import LocalAreas from '@/components/home/LocalAreas'
import DoctorAuthority from '@/components/locations/DoctorAuthority'
import LocationReviews from '@/components/locations/LocationReviews'
import LocationFAQ from '@/components/locations/LocationFAQ'
import InternalLinks from '@/components/locations/InternalLinks'
export const dynamic = 'force-dynamic'
import { loadConfig } from '@/lib/config'
import Footer from '@/components/Footer'
import '@/app/styles/locations.css'

export default async function LocationsPage() {
  const cfg = await loadConfig()
  const sc = buildSchemaConfig(cfg)
  const pageSchemas = generatePageSchemas(sc, {
    pageType: 'home',
    meta: {
      path:        '/locations',
      name:        `Locations | ${sc.clinic.name}`,
      description: sc.clinic.description,
      image:       sc.clinic.image,
      breadcrumb:  [
        { name: 'Home', url: sc.site.url, path: '/' },
        { name: 'Locations', url: sc.site.url + '/locations', path: '/locations' },
      ],
    },
  })

  return (
    <>
      <SchemaMarkup graphs={[pageSchemas]} />
      <Header clinic={cfg.clinic} />
      <main>
        <LocationsHero clinic={cfg.clinic} />
        <LocationIntro clinic={cfg.clinic} doctor={cfg.doctor} />
        <ClinicDetails clinic={cfg.clinic} />
        <MapEmbed clinic={cfg.clinic} />
        <HowToReach config={cfg} />
        <ServicesAtLocation />
        <LocalAreas areas={cfg.localAreas} clinic={cfg.clinic} />
        <DoctorAuthority doctor={cfg.doctor} />
        <LocationReviews />
        <LocationFAQ />
        <InternalLinks areas={cfg.localAreas} doctorName={cfg.doctor.name} />
        <CTABand cta={cfg.ctaBand} />
        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
