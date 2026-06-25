import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildConditionMetadata } from '@/lib/seo'
export const dynamic = 'force-dynamic'
import { loadConfig } from '@/lib/config'
import { mapCondition } from '@/lib/transform'
import ConditionDetail from '@/components/condition/ConditionDetail'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StickyBar from '@/components/StickyBar'
import '@/app/styles/conditions.css'
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
  const rawConditions: any[] = fallback?.s07?.conditions ?? []
  const condition = rawConditions.find((c: any) => c.slug === params.slug)
  if (!condition) return { title: 'Condition Not Found' }
  const photoUrl = (config.photos as any)?.[`condition_${params.slug}`] ?? null
  return buildConditionMetadata(config, condition, photoUrl)
}

export default async function ConditionDetailPage({ params }: PageParams) {
  const [config, rawConfig] = await Promise.all([loadConfig(), getRawConfig()])
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const rawJson = require('@/data/raw.json')
  const fallback = rawConfig ?? rawJson
  const rawConditions: any[] = fallback?.s07?.conditions ?? []
  const condition = rawConditions.find((c: any) => c.slug === params.slug)
  if (!condition) notFound()
  const photoUrl = (config.photos as any)?.[`condition_${params.slug}`] ?? null
  const mapped = mapCondition(condition, fallback, photoUrl)

  // Build related conditions list (excluding current)
  const allConditions = rawConditions
    .filter((c: any) => c.slug !== params.slug)
    .map((c: any) => ({ name: c.name || c.title || c.slug, slug: c.slug }))
    .slice(0, 6)

  // Build all procedures list for internal linking
  const rawProcedures: any[] = fallback?.s08?.procedures ?? []
  const allProcedures = rawProcedures
    .map((p: any) => ({ name: p.name || p.title || p.slug, slug: p.slug }))
    .slice(0, 4)

  const doctorName = fallback?.s03?.name || ''
  return (
    <>
      <Header clinic={config.clinic} />
      <StickyBar clinic={config.clinic} />
      <ConditionDetail
        {...mapped}
        allConditions={allConditions}
        allProcedures={allProcedures}
        doctorName={doctorName ? `Dr. ${doctorName}` : ''}
      />
      <Footer clinic={config.clinic} config={config} />
    </>
  )
}
