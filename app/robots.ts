import { MetadataRoute } from 'next'
import { loadConfig } from '@/lib/config'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const cfg  = await loadConfig()
const clinic = cfg.clinic as any
  const base = (clinic?.website || '').replace(/\/$/, '')
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        disallow:  ['/api/', '/_next/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
