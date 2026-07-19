import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildConditionMetadata } from '@/lib/seo'
export const revalidate = 3600
import { loadConfig } from '@/lib/config'
import { mapCondition } from '@/lib/transform'
import ConditionDetail from '@/components/condition/ConditionDetail'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StickyBar from '@/components/StickyBar'
import SchemaMarkup from '@/components/SchemaMarkup'
import { generatePageSchemas } from '@/lib/schema/index.js'
import { buildSchemaConfig } from '@/lib/schema/master.config.js'
import '@/app/styles/conditions.css'
interface PageParams { params: { slug: string } }

const arr = (v: unknown): any[] => Array.isArray(v) ? v : []

// conditionSchema() (lib/schema/contentSchemas.js) expects a flatter shape
// than mapCondition()'s ConditionDetail-oriented output, so build it separately
// from the raw s07 item and default every array to avoid crashing on
// not-yet-AI-enriched conditions (ConfigEditor only guarantees name/slug).
function toConditionSchemaData(raw: any) {
  const symptoms = raw?.symptoms ?? {}
  return {
    slug: raw?.slug || '',
    name: raw?.name || '',
    alternateName: raw?.alternateName || raw?.name || '',
    description: raw?.description || raw?.descriptionLong || raw?.shortDescription || '',
    icdCode: raw?.icd10 || raw?.icd10Code || '',
    anatomy: raw?.anatomy || '',
    symptoms: [...arr(symptoms.early), ...arr(symptoms.moderate), ...arr(symptoms.advanced)],
    risks: arr(raw?.causes),
    complications: raw?.complications || '',
    epidemiology: raw?.prevalence || '',
    prognosis: raw?.progressionType || '',
    treatments: arr(raw?.treatments).map((t: any) => typeof t === 'string' ? t : (t?.name || '')).filter(Boolean),
    diagnosisMethod: raw?.diagnosisMethod || '',
    faq: arr(raw?.faqs).map((f: any) => ({ q: f.question ?? f.q ?? '', a: f.answer ?? f.a ?? '' })),
  }
}
async function getRawConfig() {
  const configId = process.env.NEXT_PUBLIC_CONFIG_ID
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!configId || !sbUrl || !sbKey) return null
  const res = await fetch(
    `${sbUrl}/rest/v1/configs?select=data&id=eq.${encodeURIComponent(configId)}&limit=1`,
    { headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }, next: { revalidate: 3600 } }
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

  const sc = buildSchemaConfig(config)
  const schemaData = toConditionSchemaData(condition)
  const _path = `/conditions/${params.slug}`
  const pageSchemas = generatePageSchemas(sc, {
    pageType: 'condition',
    pageData: schemaData,
    meta: {
      path: _path,
      name: `${schemaData.name} | ${sc.clinic.name}`,
      description: schemaData.description,
      image: photoUrl || sc.clinic.image,
      breadcrumb: [
        { name: 'Home', url: sc.site.url, path: '/' },
        { name: schemaData.name, url: sc.site.url + _path, path: _path },
      ],
    },
  })

  const stats = ((config.doctor as any)?.stats || []) as { number: string; label: string }[]
  const findStat = (re: RegExp) => stats.find(s => re.test(s.label || ''))?.number || ''

  return (
    <>
      <SchemaMarkup graphs={[pageSchemas]} />
      <Header clinic={config.clinic} />
      <StickyBar clinic={config.clinic} />
      <ConditionDetail
        {...mapped}
        allConditions={allConditions}
        allProcedures={allProcedures}
        doctorName={doctorName ? (/^dr\.?\s/i.test(doctorName) ? doctorName : `Dr. ${doctorName}`) : ''}
        experienceYears={findStat(/year|exp/i)}
        proceduresDone={findStat(/procedure/i)}
        consultationFee={(config.clinic as any)?.consultationFee || ''}
        currency={(config.clinic as any)?.currenciesAccepted || 'INR'}
      />
      <Footer clinic={config.clinic} config={config} />
    </>
  )
}
