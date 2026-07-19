import { Icon, type IconName } from '@/lib/icons'

/**
 * AI Fact Box — a compact strip of key facts + a visible entity-attribution
 * line, shown directly under the H1 on condition / procedure / package pages.
 * Surfaces relationships that otherwise live only in JSON-LD (doctor · clinic ·
 * subject) plus at-a-glance facts (experience, procedures, fee, price, etc.).
 * Every fact is optional — empties are dropped, so the box shows only what the
 * clinic has actually supplied, and renders nothing at all if there's no data.
 */
export interface FactItem { icon: IconName; value: string; label: string }

export default function FactBox({
  facts = [],
  role,
  doctorName,
  clinicName,
}: {
  facts?: FactItem[]
  /** Verb phrase for the attribution line, e.g. "Treated by" / "Performed by". */
  role?: string
  doctorName?: string
  clinicName?: string
}) {
  const shown = facts.filter(f => f.value)

  // Build the attribution line, deduping when the clinic is named after the
  // doctor (so we don't render "Treated by Dr X at Dr X").
  const d = doctorName?.trim()
  const c = clinicName?.trim()
  let attribution = ''
  if (role && d) {
    attribution = `${role} ${d}`
    if (c && c.toLowerCase() !== d.toLowerCase()) attribution += ` at ${c}`
  } else if (c) {
    attribution = `At ${c}`
  }

  if (!shown.length && !attribution) return null

  return (
    <div className="fact-box">
      {shown.length > 0 && (
        <div className="fact-box-facts">
          {shown.map((f, i) => (
            <div key={i} className="fact-chip">
              <Icon name={f.icon} size={15} />
              <span className="fact-chip-value">{f.value}</span>
              <span className="fact-chip-label">{f.label}</span>
            </div>
          ))}
        </div>
      )}
      {attribution && <p className="fact-box-attribution">{attribution}</p>}
    </div>
  )
}
