import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-jakarta',
})
import './globals.css'
import SchemaMarkup from '@/components/SchemaMarkup'
import { generateCoreSchemas } from '@/lib/schema/index.js'
import { buildSchemaConfig } from '@/lib/schema/master.config.js'
import { loadConfig } from '@/lib/config'
import { buildRootMetadata } from '@/lib/seo'
import AppointmentModal from '@/components/appointment/AppointmentModal'

// Derive dark/deep/light shades from brand hex colors
function darken(hex: string, amount = 0.15): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, ((n >> 16) & 0xff) - Math.round(255 * amount))
  const g = Math.max(0, ((n >> 8)  & 0xff) - Math.round(255 * amount))
  const b = Math.max(0, ((n)       & 0xff) - Math.round(255 * amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
function lighten(hex: string, opacity = 0.08): string {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 0xff
  const g = (n >> 8)  & 0xff
  const b = (n)       & 0xff
  return `rgba(${r},${g},${b},${opacity})`
}
const isHex = (v: any) => typeof v === 'string' && /^#[0-9A-Fa-f]{6}$/.test(v)

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await loadConfig()
  const logoUrl = (cfg as any).clinic?.logo || (cfg as any).brand?.logoUrl || '/favicon.svg'
  return {
    ...buildRootMetadata(cfg),
    icons: { icon: logoUrl, shortcut: logoUrl, apple: logoUrl },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cfg = await loadConfig()

  // Brand colors from config, with hex validation + fallbacks
  const brand          = (cfg as any).brand ?? {}
  const primaryColor   = isHex(brand.primaryColor)   ? brand.primaryColor   : '#0d7a5f'
  const secondaryColor = isHex(brand.secondaryColor) ? brand.secondaryColor : '#1a4ea0'

  const cssVars = {
    '--primary':         primaryColor,
    '--primary-dark':    darken(primaryColor, 0.12),
    '--primary-light':   lighten(primaryColor, 0.08),
    '--primary-pale':    lighten(primaryColor, 0.15),
    '--secondary':       secondaryColor,
    '--secondary-dark':  darken(secondaryColor, 0.12),
    '--secondary-deep':  darken(secondaryColor, 0.25),
    '--secondary-light': lighten(secondaryColor, 0.08),
  } as React.CSSProperties

  const coreSchemas = generateCoreSchemas(buildSchemaConfig(cfg))

  return (
    <html lang="en" className={plusJakarta.className}>
      <head>
        <SchemaMarkup graphs={[coreSchemas]} />
        <link rel="preconnect" href="https://chuhaiskxbwpwoilzgcs.supabase.co" />
        <link rel="dns-prefetch" href="https://chuhaiskxbwpwoilzgcs.supabase.co" />
        {cfg.clinic?.image && <link rel="preload" as="image" href={cfg.clinic.image} />}
      </head>
      <body style={{ ...cssVars, paddingBottom: "64px" }}>
      {children}
      <script dangerouslySetInnerHTML={{ __html: `window.__CLINIC__ = ${JSON.stringify({ whatsapp: cfg.clinic.whatsapp, name: cfg.clinic.name })}` }} />
      <AppointmentModal />
    </body>
    </html>
  )
}
// rebuild
