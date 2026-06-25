import Header from '@/components/Header'
import SchemaMarkup from '@/components/SchemaMarkup'
import { generatePageSchemas } from '@/lib/schema/index.js'
import { buildSchemaConfig } from '@/lib/schema/master.config.js'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import AppointmentHero from '@/components/appointment/AppointmentHero'
import AppointmentForm from '@/components/appointment/AppointmentForm'
import ClinicStrip from '@/components/appointment/ClinicStrip'
import WhatToExpect from '@/components/appointment/WhatToExpect'
export const dynamic = 'force-dynamic'
import { loadConfig } from '@/lib/config'
import type { Metadata } from 'next'
import { buildAppointmentMetadata } from '@/lib/seo'
import Footer from '@/components/Footer'
import '@/app/styles/appointment.css'

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await loadConfig()
  return buildAppointmentMetadata(cfg)
}

export default async function AppointmentPage() {
  const cfg = await loadConfig()
  const sc = buildSchemaConfig(cfg)
  const pageSchemas = generatePageSchemas(sc, {
    pageType: 'home',
    meta: {
      path:        '/appointment',
      name:        `Book Appointment | ${sc.clinic.name}`,
      description: sc.clinic.description,
      image:       sc.clinic.image,
      breadcrumb:  [
        { name: 'Home', url: sc.site.url, path: '/' },
        { name: 'Book Appointment', url: sc.site.url + '/appointment', path: '/appointment' },
      ],
    },
  })

  return (
    <>
      <SchemaMarkup graphs={[pageSchemas]} />
      <Header clinic={cfg.clinic} />
      <main>
        <AppointmentHero />
        <AppointmentForm clinic={cfg.clinic} />
        <ClinicStrip clinic={cfg.clinic} />
        <WhatToExpect />
        <CTABand cta={cfg.ctaBand} />
        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
