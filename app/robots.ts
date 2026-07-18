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
        disallow:  ['/api/'],
      },
      // AI citation crawlers, explicitly allowed. A named group replaces the
      // '*' group for that bot, so /api/ must be re-disallowed here too.
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'anthropic-ai', 'PerplexityBot', 'Google-Extended', 'CCBot'],
        allow:     '/',
        disallow:  ['/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
