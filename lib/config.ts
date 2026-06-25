/**
 * lib/config.ts
 *
 * HOW IT WORKS
 * ─────────────
 * If NEXT_PUBLIC_CONFIG_ID is set (all client deployments):
 *   → Fetches config from Supabase, throws on failure — never falls back to JSON
 *
 * If NEXT_PUBLIC_CONFIG_ID is NOT set (local dev / template preview):
 *   → Falls back to data/templatedefault.json
 *
 * Client repos (metro-eye, rangdhal, etc) always have CONFIG_ID set in Vercel.
 * templatedefault.json is only used in the template repo for local development.
 */

import type { ClinicConfig } from './types'
import { transformConfig }   from './transform'
import templateDefault       from '../data/templatedefault.json'

const SLUG      = process.env.NEXT_PUBLIC_CLINIC_SLUG
const CONFIG_ID = process.env.NEXT_PUBLIC_CONFIG_ID
const SB_URL    = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID
const BUCKET    = 'website-assets'

// Module-level cache — populated by initConfig()
let _cache: ClinicConfig | null = null

async function fetchFromSupabase(): Promise<ClinicConfig> {
  // No CONFIG_ID — local dev, use templatedefault.json
  if (!CONFIG_ID) {
    console.log('[config] No CONFIG_ID — using templatedefault.json')
    return templateDefault as unknown as ClinicConfig
  }

  if (!SB_URL || !SB_KEY) {
    throw new Error('[config] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }

  const res = await fetch(
    `${SB_URL}/rest/v1/configs?select=data&id=eq.${encodeURIComponent(CONFIG_ID)}&limit=1`,
    {
      headers: {
        apikey:         SB_KEY,
        Authorization:  `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    throw new Error(`[config] Supabase fetch failed with status ${res.status} for CONFIG_ID: ${CONFIG_ID}`)
  }

  const rows = await res.json()
  if (!rows?.length) {
    throw new Error(`[config] No config found in Supabase for CONFIG_ID: ${CONFIG_ID}`)
  }

  const configJson = rows[0]?.data
  if (!configJson || typeof configJson !== 'object') {
    throw new Error(`[config] Config data is empty for CONFIG_ID: ${CONFIG_ID}`)
  }

  console.log(`[config] Loaded Supabase config for id: ${CONFIG_ID}`)
  const transformed = transformConfig(configJson)

  // Inject photo URLs from Supabase Storage
  if (CLIENT_ID && SB_URL) {
    try {
      const wRes = await fetch(
        `${SB_URL}/rest/v1/websites?select=photos&client_id=eq.${CLIENT_ID}&limit=1`,
        { headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}` }, cache: 'no-cache' }
      )
      const wRows = await wRes.json()
      const uploadedPhotos: Record<string, string> = wRows?.[0]?.photos || {}
      transformed.photos = uploadedPhotos
      transformed.clinic = {
        ...transformed.clinic,
        logo:       uploadedPhotos['logo']       || '',
        heroImage:  uploadedPhotos['hero_image'] || '',
        aboutImage: uploadedPhotos['about']      || '',
      }
      transformed.doctor = {
        ...transformed.doctor,
        photo: uploadedPhotos['doctor_card'] || transformed.doctor.photo || '',
      }
      transformed.conditions = transformed.conditions.map((c: any) => ({
        ...c,
        image: uploadedPhotos[`condition_${c.href.split('/').pop()}`] || '',
      }))
      transformed.procedures = transformed.procedures.map((p: any) => ({
        ...p,
        image: uploadedPhotos[`procedure_${p.href.split('/').pop()}`] || '',
      }))
      transformed.services = {
        ...transformed.services,
        conditions: (transformed.services?.conditions || []).map((c: any) => ({
          ...c,
          image: uploadedPhotos[`condition_${c.slug}`] || '',
        })),
        procedures: (transformed.services?.procedures || []).map((p: any) => ({
          ...p,
          image: uploadedPhotos[`procedure_${p.slug}`] || '',
        })),
      }
      transformed.team = transformed.team.map((m: any) => ({
        ...m,
        photo: uploadedPhotos[`team_member_${m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`] || '',
      }))
    } catch (e) {
      console.error('[config] Failed to fetch photos:', e)
      transformed.photos = {}
    }
  } else {
    transformed.photos = {}
  }

  return transformed
}

/** Initialise config once. Safe to call multiple times. */
export async function initConfig(): Promise<ClinicConfig> {
  if (_cache) return _cache
  _cache = await fetchFromSupabase()
  return _cache
}

/**
 * Synchronous getter — returns cached config after initConfig() resolves.
 * Falls back to templatedefault.json if called before cache is warm.
 */
export function getConfig(): ClinicConfig {
  return _cache ?? (templateDefault as unknown as ClinicConfig)
}

/** Async convenience: init + get in one call for Server Components. */
export async function loadConfig(): Promise<ClinicConfig> {
  return initConfig()
}
