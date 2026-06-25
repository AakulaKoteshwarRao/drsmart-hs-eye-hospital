import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'
export const dynamic = 'force-dynamic'
import { loadConfig } from '@/lib/config'
import { mapPackage } from '@/lib/transform'
import PackageDetail from '@/components/package/PackageDetail'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StickyBar from '@/components/StickyBar'
import '@/app/styles/packages.css'

interface PageParams { params: { slug: string } }

async function getRawConfig() {
  const configId = process.env.NEXT_PUBLIC_CONFIG_ID
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!configId || !sbUrl || !sbKey) return null
  const res = await fetch(
    `${sbUrl}/rest/v1/configs?select=data&id=eq.${encodeURIComponent(configId)}&limit=1`,
    { headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }, cache: 'no-cache' }
  )
  const rows = await res.json()
  return rows?.[0]?.data ?? null
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const [config, rawConfig] = await Promise.all([loadConfig(), getRawConfig()])
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const rawJson = require('@/data/raw.json')
  const fallback = rawConfig ?? rawJson
  const rawPackages: any[] = fallback?.s10?.packages ?? []
  const pkg = rawPackages.find((pk: any) => pk.slug === params.slug)
  if (!pkg) return { title: 'Package Not Found' }
  const clinic = config.clinic as any
  return buildPageMetadata(config, {
    title:       pkg.title || pkg.name || 'Treatment Package',
    description: pkg.description || pkg.summary || `${pkg.title || 'Treatment package'} available at ${clinic?.name || 'our clinic'} in ${clinic?.city || ''}.`,
    path:        `/packages/${params.slug}`,
  })
}

export default async function PackageDetailPage({ params }: PageParams) {
  const [config, rawConfig] = await Promise.all([loadConfig(), getRawConfig()])
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const rawJson = require('@/data/raw.json')
  const fallback = rawConfig ?? rawJson
  const rawPackages: any[] = fallback?.s10?.packages ?? []
  const pkg = rawPackages.find((pk: any) => pk.slug === params.slug)
  if (!pkg) notFound()
  const photoUrl = (config.photos as any)?.[`package_${params.slug}`] ?? null
  const mapped = mapPackage(pkg, fallback, photoUrl)
  return (
    <>
      <Header clinic={config.clinic} />
      <StickyBar clinic={config.clinic} />
      <PackageDetail {...mapped} />
      <Footer clinic={config.clinic} config={config} />
    </>
  )
}
