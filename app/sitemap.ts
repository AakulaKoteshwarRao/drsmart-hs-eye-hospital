import { MetadataRoute } from 'next'
import { loadConfig } from '@/lib/config'
import { getBlogs } from '@/lib/blogs'

// Real config-row modification date, so lastmod only moves when content
// actually changes instead of stamping every URL with regeneration time
async function getConfigUpdatedAt(): Promise<Date | null> {
  const configId = process.env.NEXT_PUBLIC_CONFIG_ID
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!configId || !sbUrl || !sbKey) return null
  try {
    const res = await fetch(
      `${sbUrl}/rest/v1/configs?select=updated_at&id=eq.${encodeURIComponent(configId)}&limit=1`,
      { headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }, next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const rows = await res.json()
    const ts = rows?.[0]?.updated_at
    return ts ? new Date(ts) : null
  } catch {
    return null
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cfg     = await loadConfig()
  const clinic  = cfg.clinic  as any
  const raw  = clinic?.website || (cfg.site as any)?.url || ''
  const base = raw ? (raw.startsWith('http') ? raw : `https://${raw}`).replace(/\/$/, '') : ''

  const now = (await getConfigUpdatedAt()) ?? new Date()

  // Blogs fetched early: newest post date drives the /blog index lastmod
  const blogs = await getBlogs()
  const newestPost = blogs[0]?.published_at ? new Date(blogs[0].published_at) : null

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`,            lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/doctor`,      lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/about`,       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`,     lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/appointment`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog`,        lastModified: newestPost ?? now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/services`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/locations`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/gallery`,     lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/reviews`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${base}/team`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/packages`,        lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/success-stories`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
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

  // Location spoke pages — canonical URL, not the bare-slug redirect
  const areas = (cfg.areas || (cfg as any).localAreas || []) as any[]
  const areaPages: MetadataRoute.Sitemap = areas.map((a) => ({
    url:             `${base}/specialist-near-${a.slug}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.7,
  }))

  // Individual blog posts — real published_at dates, not the shared "now" timestamp
  const blogPages: MetadataRoute.Sitemap = blogs.map((b) => ({
    url:             `${base}/blog/${b.slug}`,
    lastModified:    b.published_at ? new Date(b.published_at) : now,
    changeFrequency: 'monthly',
    priority:        0.6,
  }))

  return [
    ...staticPages,
    ...conditionPages,
    ...procedurePages,
    ...packagePages,
    ...areaPages,
    ...blogPages,
  ]
}
