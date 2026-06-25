import { getConfig } from '@/lib/config'
import type { AreaItem } from '@/lib/types'

const pageLinks = [
  { label: 'About the Clinic', href: '/about' },
  { label: 'Patient Reviews', href: '/testimonials' },
  { label: 'Treatment Packages', href: '/products' },
  { label: 'Book Appointment', href: '/appointment' },
]

export default function InternalLinks({ areas, doctorName }: { areas: AreaItem[]; doctorName: string }) {
  const cfg = getConfig()
  const conditions = (cfg.conditions || []).slice(0, 3)
  const procedures = (cfg.procedures || []).slice(0, 2)
  const serviceLinks = [
    ...conditions.map((s: any) => ({ label: s.title || s.label, href: `/conditions/${s.slug}` })),
    ...procedures.map((p: any) => ({ label: p.title || p.label, href: `/procedures/${p.slug}` })),
  ]
  return (
    <section className="internal-links">
      <h3>Quick Links</h3>
      <div className="links-wrap">
        {areas.map((a, i) => (
          <a key={i} href={`/locations/${a.slug}`} className="int-link">Specialist in {a.name}</a>
        ))}
        {serviceLinks.map((l, i) => (
          <a key={i} href={l.href} className="int-link">{l.label}</a>
        ))}
        <a href="/doctor" className="int-link">{doctorName}</a>
        {pageLinks.map((l, i) => (
          <a key={i} href={l.href} className="int-link">{l.label}</a>
        ))}
      </div>
    </section>
  )
}
