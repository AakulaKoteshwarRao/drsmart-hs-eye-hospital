'use client'
import type { AreaItem, ClinicInfo } from "@/lib/types"
import { Icon } from "@/lib/icons"
import { PILL_STYLES } from "@/lib/pills"

export default function LocalAreas({ areas, clinic }: { areas: AreaItem[]; clinic: ClinicInfo }) {
  return (
    <section className="areas-section">
      <div className="sec-header">
        <div className="sec-label"><span>Serving {clinic.city}</span></div>
        <h2 className="sec-title">Conveniently located for you.</h2>
        <p className="sec-sub">We serve patients from across {clinic.city} and surrounding areas.</p>
      </div>
      <div className="areas-grid-8">
        {areas.map((area, i) => (
          <a key={i} href={area.href} className="area-tag" style={{ background: PILL_STYLES[i % PILL_STYLES.length].background, borderColor: PILL_STYLES[i % PILL_STYLES.length].color }}>
            <span className="area-name" style={{ color: PILL_STYLES[i % PILL_STYLES.length].color }}>{area.label}</span>
            {(area.distance || area.duration) && (
              <span className="area-meta" style={{ color: "#ffffff" }}>
                {area.distance && <span><Icon name="location" size={11} />{area.distance}</span>}
                {area.duration && <span><Icon name="clock" size={11} />{area.duration}</span>}
              </span>
            )}
          </a>
        ))}
      </div>
      <p className="areas-sub">
        Located in {clinic.address}. Easily accessible by car and public transport.{" "}
        <a href={clinic.mapUrl} target="_blank" rel="noreferrer"
          style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
          Get directions &rarr;
        </a>
      </p>
    </section>
  )
}
