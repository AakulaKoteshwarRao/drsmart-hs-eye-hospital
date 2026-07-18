import '@/app/styles/location-spoke.css'
import Header from '@/components/Header'
import StickyBar from '@/components/StickyBar'
import CTABand from '@/components/home/CTABand'
import Footer from '@/components/Footer'
import LocationSpoke from '@/components/location/LocationSpoke'
import { loadConfig } from '@/lib/config'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { buildLocationMetadata } from '@/lib/seo'
import SchemaMarkup from '@/components/SchemaMarkup'
import { generatePageSchemas } from '@/lib/schema/index.js'
import { buildSchemaConfig } from '@/lib/schema/master.config.js'

export const revalidate = 3600

// Next.js won't reliably prioritize a more-specific sibling dynamic route
// (app/specialist-near-[area]) over this plain catch-all when they're siblings —
// so this single route handles both cases itself instead of relying on two
// competing route folders. Bare slugs (e.g. /nizamabad) redirect to the
// canonical /specialist-near-[area] URL; the canonical URL itself is served here.
const PREFIX = 'specialist-near-'

export async function generateMetadata({ params }: { params?: { area?: string } }): Promise<Metadata> {
  const slug = params?.area || ''
  if (!slug.startsWith(PREFIX)) return {}
  const cfg = await loadConfig()
  const areaSlug = slug.slice(PREFIX.length)
  const areaFromConfig = (cfg.areas || (cfg as any).localAreas || []).find((a: any) => a.slug === areaSlug)
  const slugToName = (s: string) => s.split('-').map((w: string) =>
    w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ')
  const areaName = areaFromConfig?.name || slugToName(areaSlug)
  return buildLocationMetadata(cfg, { name: areaName, slug: areaSlug, description: areaFromConfig?.description })
}

export default async function LocationSpokePage({ params }: { params?: { area?: string } }) {
  const slug = params?.area || ''

  if (!slug.startsWith(PREFIX)) {
    redirect(`/${PREFIX}${slug}`)
  }

  const cfg = await loadConfig()
  const areaSlug = slug.slice(PREFIX.length)

  // Find area from config first (has correct name), fallback to slug conversion
  const areaFromConfig = (cfg.areas || cfg.localAreas || []).find((a: any) => a.slug === areaSlug)
  // Convert slug to readable name - handle short abbreviations (sr, jb, etc) as uppercase
  const slugToName = (s: string) => s.split('-').map((w: string) =>
    w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ')
  const areaName = areaFromConfig?.name || slugToName(areaSlug)

  if (!areaFromConfig) notFound()
  const area = areaFromConfig || { name: areaName, slug: areaSlug, distance: '', duration: '' }

  const sc = buildSchemaConfig(cfg)
  const _path = `/specialist-near-${areaSlug}`
  const location = {
    slug: areaSlug,
    name: areaName,
    url: sc.site.url + _path,
    areasServed: [areaName],
  }
  const pageSchemas = generatePageSchemas(sc, {
    pageType: 'location',
    pageData: location,
    meta: {
      path: _path,
      name: `${areaName} | ${sc.clinic.name}`,
      description: `${sc.clinic.name} serving ${areaName}`,
      image: sc.clinic.image,
      breadcrumb: [
        { name: 'Home', url: sc.site.url, path: '/' },
        { name: areaName, url: sc.site.url + _path, path: _path },
      ],
    },
  })

  return (
    <>
      <SchemaMarkup graphs={[pageSchemas]} />
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
