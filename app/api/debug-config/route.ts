import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const configId = process.env.NEXT_PUBLIC_CONFIG_ID
  const sbUrl    = process.env.NEXT_PUBLIC_SUPABASE_URL
  const sbKey    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
  const slug     = process.env.NEXT_PUBLIC_CLINIC_SLUG

  const envCheck = { configId, sbUrl: !!sbUrl, sbKey: !!sbKey, clientId, slug }

  if (!configId || !sbUrl || !sbKey) {
    return NextResponse.json({ error: 'missing env vars', envCheck })
  }

  const res = await fetch(
    `${sbUrl}/rest/v1/configs?select=data&id=eq.${configId}&limit=1`,
    { headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }, cache: 'no-cache' }
  )

  const rows = await res.json()
  const data = rows?.[0]?.data

  return NextResponse.json({
    envCheck,
    status: res.status,
    rowCount: rows?.length,
    hasData: !!data,
    sections: data ? Object.keys(data) : null,
    s07conditionsCount: data?.s07?.conditions?.length ?? 0,
    s07slugs: data?.s07?.conditions?.map((c: any) => c.slug) ?? [],
  })
}
