/**
 * lib/blogs.ts
 * Runtime fetch of blog posts from Supabase blogs table.
 * Used by blog/page.tsx (list) and blog/[slug]/page.tsx (detail).
 *
 * Blogs are fetched at request time — no redeploy needed when publishing.
 * Falls back to empty array / null if Supabase is unavailable.
 *
 * Supabase blogs table columns (from P2 schema):
 *   id, client_id, title, slug, excerpt, content (HTML),
 *   category, tags, status ('draft'|'published'), featured_image,
 *   published_at, created_at, updated_at, meta_title, meta_description
 *
 * clients table has: id, slug (e.g. "dr-arjun-neuro-care")
 */

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SLUG   = process.env.NEXT_PUBLIC_CLINIC_SLUG

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string          // full HTML content
  category: string
  tags: string[]
  status: string
  featured_image: string
  published_at: string
  meta_title: string
  meta_description: string
  // Optional FAQ column ([{question, answer}] jsonb) — flows through the
  // detail page's select=* automatically once the column exists in Supabase
  faq?: { question?: string; answer?: string; q?: string; a?: string }[]
}

async function sbFetch(path: string): Promise<any[] | null> {
  if (!SB_URL || !SB_KEY || !SLUG) return null
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// Fetch all published blogs for this client, ordered newest first
export async function getBlogs(): Promise<BlogPost[]> {
  const rows = await sbFetch(
`blogs?select=id,title,slug,excerpt,category,tags,status,featured_image,published_at,meta_title,meta_description,clients!inner(slug)&clients.slug=eq.${SLUG}&status=eq.published&order=published_at.desc`  )
  return (rows || []) as BlogPost[]
}

// Fetch a single blog by slug for this client
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const rows = await sbFetch(
`blogs?select=*,clients!inner(slug)&clients.slug=eq.${SLUG}&slug=eq.${slug}&status=eq.published&limit=1`  )
  if (!rows || rows.length === 0) return null
  return rows[0] as BlogPost
}
