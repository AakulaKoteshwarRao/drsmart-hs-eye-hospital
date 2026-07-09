/**
 * lib/seo.ts
 *
 * Central SEO utility — single source of truth for all metadata across every page.
 *
 * HOW TO USE
 * ──────────
 * import { buildTitle, buildDescription, buildCanonical, buildPageMetadata } from '@/lib/seo'
 *
 * In any page.tsx:
 *   export async function generateMetadata({ params }): Promise<Metadata> {
 *     const cfg = await loadConfig()
 *     return buildPageMetadata(cfg, {
 *       title:       'Knee Arthritis Treatment',
 *       description: 'Expert knee arthritis treatment using robotic surgery...',
 *       path:        `/conditions/${params.slug}`,
 *       image:       photoUrl,
 *     })
 *   }
 *
 * RULES ENFORCED AUTOMATICALLY
 * ─────────────────────────────
 * 1. Title format   → "Primary Keyword in City | Dr. Name"
 * 2. Meta desc      → trimmed to 155 chars, includes keyword + location
 * 3. Canonical      → absolute URL on every page, no duplicates
 * 4. OG tags        → title, description, image, url, siteName on every page
 * 5. Twitter card   → summary_large_image on every page
 * 6. Robots         → index/follow by default, noindex for admin/legal pages
 *
 * TO CHANGE A RULE GLOBALLY
 * ──────────────────────────
 * Edit this file once → all pages across all client sites update on next redeploy.
 */

import type { Metadata } from 'next'
import type { ClinicConfig } from './types'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface PageSEOInput {
  /** Primary keyword / page topic. E.g. "Knee Arthritis Treatment" */
  title: string
  /** Raw description text — will be trimmed to 155 chars automatically */
  description: string
  /** Relative path for canonical URL. E.g. "/conditions/knee-arthritis" */
  path: string
  /** Optional page image URL for OG/Twitter. Falls back to clinic hero image. */
  image?: string | null
  /** Set true for privacy policy, T&C, disclaimer, 404 — adds noindex */
  noindex?: boolean
  /** Override the auto-appended " in City | Dr. Name" suffix */
  titleSuffix?: string
}

// ─────────────────────────────────────────────
// Core builders — used internally + exportable
// ─────────────────────────────────────────────

/**
 * Builds SEO title in format: "Keyword in City | Dr. Name"
 * E.g. "Knee Arthritis Treatment in Nanded | Dr. Rangdhal"
 */
export function buildTitle(
  keyword: string,
  city: string,
  doctorName: string,
  suffix?: string
): string {
  const cleanKeyword = keyword.trim()
  const cleanCity    = city?.trim()
  const cleanDoctor  = doctorName?.trim()

  if (suffix) return `${cleanKeyword} | ${suffix}`

  const locationPart = cleanCity    ? ` in ${cleanCity}`   : ''
  const doctorPart   = cleanDoctor  ? ` | ${cleanDoctor}`  : ''

  return `${cleanKeyword}${locationPart}${doctorPart}`
}

/**
 * Trims description to 155 chars at word boundary.
 * Appends city if not already mentioned, for local SEO signal.
 */
export function buildDescription(text: string, city?: string): string {
  // Strip any HTML tags or citation markup that may come from content generators
  let desc = (text?.trim() || '').replace(/<[^>]+>/g, '').replace(/&lt;[^&]+&gt;/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim()

  // Append city if not already in description
  if (city && !desc.toLowerCase().includes(city.toLowerCase())) {
    desc = `${desc} Serving patients in ${city}.`
  }

  // Trim to 155 chars at word boundary
  if (desc.length > 155) {
    desc = desc.substring(0, 152).replace(/\s+\S*$/, '') + '...'
  }

  return desc
}

/**
 * Builds absolute canonical URL from site base URL + path.
 * Strips trailing slashes. Handles missing base URL gracefully.
 */
export function buildCanonical(baseUrl: string, path: string): string {
  const base  = (baseUrl || '').replace(/\/$/, '')
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${base}${clean}`
}

/**
 * Extracts doctor display name from config.
 * Format: "Dr. FirstName LastName"
 */
function getDoctorName(cfg: ClinicConfig): string {
  const doctor = cfg.doctor as any
  if (!doctor) return ''
  const name = doctor.name || doctor.fullName || ''
  if (!name) return ''
  return name.startsWith('Dr') ? name : `Dr. ${name}`
}

// ─────────────────────────────────────────────
// Root layout metadata (used in app/layout.tsx)
// ─────────────────────────────────────────────

/**
 * Generates root-level metadata for app/layout.tsx.
 * This is the fallback for pages that don't define their own generateMetadata().
 */
export function buildRootMetadata(cfg: ClinicConfig): Metadata {
  const clinic     = cfg.clinic as any
  const name       = clinic?.name             || 'Clinic'
  const city       = clinic?.city             || ''
  const specialty  = clinic?.medicalSpecialty || ''
  const doctorName = getDoctorName(cfg)
  const raw = clinic?.website || (cfg.site as any)?.url || ''
  const baseUrl = raw ? (raw.startsWith('http') ? raw : `https://${raw}`).replace(/\/$/, '') : ''
  const image      = clinic?.heroImage || clinic?.logo || ''

  // Root title: "Specialty in City | Dr. Name"
  const title = buildTitle(specialty || name, city, doctorName)

  // Root description: tagline or auto-built
  const tagline    = clinic?.tagline || (specialty && city ? `${specialty} in ${city}` : specialty || 'Healthcare services')
  const description = buildDescription(tagline, city)
  const canonical   = buildCanonical(baseUrl, '/')

  return {
    title: {
      default:  title,
      template: `%s in ${city} | ${doctorName}`,  // child pages use this template
    },
    description,
    metadataBase: baseUrl ? new URL(baseUrl) : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url:      canonical,
      siteName: name,
      type:     'website',
      locale:   'en_IN',
      images:   image ? [{ url: image, width: 1200, height: 630, alt: name }] : [],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      image ? [image] : [],
    },
    robots: {
      index:              true,
      follow:             true,
      googleBot: {
        index:            true,
        follow:           true,
        'max-image-preview': 'large',
      },
    },
  }
}

// ─────────────────────────────────────────────
// Page-level metadata (used in every page.tsx)
// ─────────────────────────────────────────────

/**
 * Main function — call this in generateMetadata() on every page.
 *
 * Automatically handles:
 * - Title format enforcement
 * - 155-char description trim
 * - Canonical URL
 * - OG + Twitter tags
 * - noindex for legal/admin pages
 */
export function buildPageMetadata(cfg: ClinicConfig, input: PageSEOInput): Metadata {
  const clinic     = cfg.clinic as any
  const city       = clinic?.city             || ''
  const doctorName = getDoctorName(cfg)
  const raw = clinic?.website || (cfg.site as any)?.url || ''
  const baseUrl = raw ? (raw.startsWith('http') ? raw : `https://${raw}`).replace(/\/$/, '') : ''
  const clinicName = clinic?.name             || ''

  const title       = buildTitle(input.title, city, doctorName, input.titleSuffix)
  const description = buildDescription(input.description, city)
  const canonical   = buildCanonical(baseUrl, input.path)
  const image       = input.image || clinic?.heroImage || clinic?.logo || ''

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url:      canonical,
      siteName: clinicName,
      type:     'website',
      locale:   'en_IN',
      images:   image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      image ? [image] : [],
    },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true,  follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  }
}

// ─────────────────────────────────────────────
// Page-specific helpers
// ─────────────────────────────────────────────

/** Homepage metadata */
export function buildHomeMetadata(cfg: ClinicConfig): Metadata {
  const clinic    = cfg.clinic as any
  const site      = cfg.site   as any
  const specialty = clinic?.medicalSpecialty || clinic?.name || 'Healthcare'
  const city      = clinic?.city             || ''
  const tagline   = clinic?.tagline          || ''

  return buildPageMetadata(cfg, {
    title:       specialty,
    description: tagline || `Best ${specialty} in ${city}. Book an appointment today.`,
    path:        '/',
    image:       clinic?.heroImage || clinic?.logo,
  })
}

/** Doctor/About page metadata */
export function buildDoctorMetadata(cfg: ClinicConfig): Metadata {
  const clinic = cfg.clinic as any
  const doctor = cfg.doctor as any
  const city   = clinic?.city || ''
  const name   = getDoctorName(cfg)
  // qualifications is string[]; experience is {role,hospital}[] (job history, not
  // a years-of-experience number) — years come from the doctor.stats entry instead.
  const quals  = Array.isArray(doctor?.qualifications) ? doctor.qualifications.join(', ') : (doctor?.qualifications || '')
  const yearsStat = Array.isArray(doctor?.stats)
    ? doctor.stats.find((st: any) => /year|experience|exp/i.test(st?.label || ''))
    : null
  const exp = yearsStat?.number || ''

  return buildPageMetadata(cfg, {
    title:       `${name} — ${clinic?.medicalSpecialty || 'Specialist'} in ${city}`,
    description: `${name} is an experienced ${clinic?.medicalSpecialty || 'specialist'} in ${city}. ${quals ? quals + '.' : ''} ${exp ? exp + ' years of experience.' : ''}`.trim(),
    path:        '/doctor',
    image:       doctor?.photo,
    titleSuffix: name,
  })
}

/** Condition slug page metadata */
export function buildConditionMetadata(
  cfg: ClinicConfig,
  condition: { title?: string; name?: string; slug: string; summary?: string; shortDescription?: string; description?: string },
  photoUrl?: string | null
): Metadata {
  const clinic = cfg.clinic as any
  const city   = clinic?.city || ''
  const label  = condition.title || condition.name || condition.slug
  const desc   = condition.summary || condition.shortDescription || condition.description || `Expert treatment for ${label} in ${city}.`

  return buildPageMetadata(cfg, {
    title:       `${label} Treatment`,
    description: desc,
    path:        `/conditions/${condition.slug}`,
    image:       photoUrl,
  })
}

/** Procedure slug page metadata */
export function buildProcedureMetadata(
  cfg: ClinicConfig,
  procedure: { title?: string; name?: string; slug: string; summary?: string; description?: string },
  photoUrl?: string | null
): Metadata {
  const clinic = cfg.clinic as any
  const city   = clinic?.city || ''
  const procTitle = procedure.title || procedure.name || ''
  const desc   = procedure.summary || procedure.description || `Expert ${procTitle} procedure in ${city}.`

  return buildPageMetadata(cfg, {
    title:       procTitle,
    description: desc,
    path:        `/procedures/${procedure.slug}`,
    image:       photoUrl,
  })
}

/** Blog post metadata */
export function buildBlogMetadata(
  cfg: ClinicConfig,
  post: { title: string; slug: string; excerpt?: string; coverImage?: string; publishedAt?: string }
): Metadata {
  const clinic     = cfg.clinic as any
  const city       = clinic?.city || ''
  const doctorName = getDoctorName(cfg)
  const desc       = post.excerpt || `Read about ${post.title} — expert insights from ${city}.`

  const base = buildPageMetadata(cfg, {
    title:       post.title,
    description: desc,
    path:        `/blog/${post.slug}`,
    image:       post.coverImage,
  })

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type:          'article',
      publishedTime: post.publishedAt,
      modifiedTime:  post.publishedAt,
      authors:       doctorName ? [doctorName] : undefined,
      images:        post.coverImage
        ? [{ url: post.coverImage, width: 1536, height: 1024, alt: post.title }]
        : (base.openGraph as any)?.images,
    },
  }
}

/** Location spoke page metadata */
export function buildLocationMetadata(
  cfg: ClinicConfig,
  area: { name: string; slug: string; description?: string }
): Metadata {
  const clinic    = cfg.clinic as any
  const specialty = clinic?.medicalSpecialty || 'Healthcare'
  const desc      = area.description || `Looking for ${specialty} near ${area.name}? Visit our clinic serving patients in ${area.name} and nearby areas.`

  return buildPageMetadata(cfg, {
    title:       `${specialty} near ${area.name}`,
    description: desc,
    path:        `/locations/${area.slug}`,
  })
}

/** Legal pages — noindex */
export function buildLegalMetadata(
  cfg: ClinicConfig,
  page: 'privacy-policy' | 'terms' | 'disclaimer'
): Metadata {
  const titles = {
    'privacy-policy': 'Privacy Policy',
    'terms':          'Terms and Conditions',
    'disclaimer':     'Medical Disclaimer',
  }
  const clinic = cfg.clinic as any
  return buildPageMetadata(cfg, {
    title:       titles[page],
    description: `${titles[page]} for ${clinic?.name || 'this clinic'}.`,
    path:        `/${page}`,
    noindex:     true,
    titleSuffix: clinic?.name || '',
  })
}

/** Appointment page metadata */
export function buildAppointmentMetadata(cfg: ClinicConfig): Metadata {
  const clinic    = cfg.clinic as any
  const city      = clinic?.city || ''
  const doctorName = getDoctorName(cfg)

  return buildPageMetadata(cfg, {
    title:       `Book an Appointment`,
    description: `Schedule your appointment with ${doctorName} in ${city}. Easy online booking available.`,
    path:        '/appointment',
  })
}
