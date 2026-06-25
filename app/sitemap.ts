import { MetadataRoute } from 'next'
import { loadConfig } from '@/lib/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cfg     = await loadConfig()
  const clinic  = cfg.clinic  as any
  const raw  = clinic?.website || (cfg.site as any)?.url || ''
  const base = raw ? (raw.startsWith('http') ? raw : `https://${raw}`).replace(/\/$/, '') : ''

  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`,            lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/doctor`,      lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/about`,       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`,     lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/appointment`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/services`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/locations`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/gallery`,     lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/reviews`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${base}/team`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Condition pages
  const conditions = (cfg.conditions || []) as any[]
  const conditionPages: MetadataRoute.Sitemap = conditions.map((c) => ({
    url:             `${base}/conditions/${c.slug || c.href?.split('/').pop()}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.8,
  }))

  // Procedure pages
  const procedures = (cfg.procedures || []) as any[]
  const procedurePages: MetadataRoute.Sitemap = procedures.map((p) => ({
    url:             `${base}/procedures/${p.slug || p.href?.split('/').pop()}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.8,
  }))

  // Package pages
  const packages = (cfg.packages || []) as any[]
  const packagePages: MetadataRoute.Sitemap = packages.map((pk) => ({
    url:             `${base}/packages/${pk.slug}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.7,
  }))

  // Location spoke pages
  const areas = (cfg.areas || (cfg as any).localAreas || []) as any[]
  const areaPages: MetadataRoute.Sitemap = areas.map((a) => ({
    url:             `${base}/${a.slug}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.7,
  }))

  return [
    ...staticPages,
    ...conditionPages,
    ...procedurePages,
    ...packagePages,
    ...areaPages,
  ]
}
