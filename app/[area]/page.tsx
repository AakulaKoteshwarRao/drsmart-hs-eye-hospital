import '@/app/styles/location-spoke.css'
import Header from '@/components/Header'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import Footer from '@/components/Footer'
import LocationSpoke from '@/components/location/LocationSpoke'
import { loadConfig } from '@/lib/config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildLocationMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params?: { area?: string } }): Promise<Metadata> {
  const cfg = await loadConfig()
  const areaSlug = params?.area || ''
  const areaFromConfig = (cfg.areas || (cfg as any).localAreas || []).find((a: any) => a.slug === areaSlug)
  const slugToName = (slug: string) => slug.split('-').map((w: string) =>
    w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ')
  const areaName = areaFromConfig?.name || slugToName(areaSlug)
  return buildLocationMetadata(cfg, { name: areaName, slug: areaSlug, description: areaFromConfig?.description })
}

export default async function LocationSpokePage({ params }: { params?: { area?: string } }) {
  const cfg = await loadConfig()

  const areaSlug = params?.area || ''
  // Find area from config first (has correct name), fallback to slug conversion
  const areaFromConfig = (cfg.areas || cfg.localAreas || []).find((a: any) => a.slug === areaSlug)
  // Convert slug to readable name - handle short abbreviations (sr, jb, etc) as uppercase
  const slugToName = (slug: string) => slug.split('-').map((w: string) => 
    w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ')
  const areaName = areaFromConfig?.name || slugToName(areaSlug)

  if (!areaFromConfig) notFound()
  const area = areaFromConfig || { name: areaName, slug: areaSlug, distance: '', duration: '' }

  return (
    <>
      <Header clinic={cfg.clinic} />
      <main>
        <LocationSpoke
          clinic={cfg.clinic}
          doctor={cfg.doctor}
          area={area}
          conditions={cfg.conditions || []}
          areas={cfg.areas || cfg.localAreas || []}
        />
        <CTABand cta={cfg.ctaBand} />
        <Footer clinic={cfg.clinic} config={cfg} />
      </main>
      <StickyBar clinic={cfg.clinic} />
    </>
  )
}
